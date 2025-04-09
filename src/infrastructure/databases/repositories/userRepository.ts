import { UpdateBlockStatusDTO } from "../../../application/dtos/authDTOs";

import { ChangePasswordDTO,FindEmailDTO,UpdatePasswordDTO } from "../../../application/dtos/authDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";

import { CreateGoogleUserDTO,CreateUserDTO,UpdateUserDetailsDTO } from "../../../application/dtos/userDTOs";
import { User } from "../../../domain/entities/userEntity";
import { UserRepository } from "../../../domain/interfaces/userRepository";
import UserModel from "../models/userModel";
import { GetUsersQueryDTO } from "../../../application/dtos/queryDTOs";

export class MongoUserRepository implements UserRepository {
  public async create(data: CreateUserDTO): Promise<User> {
    const userData = await UserModel.create(data);
    return userData.toObject()
  }
  public async findByEmail(data: FindEmailDTO): Promise<User | null> {
    const { email } = data;
    return await UserModel.findOne({ email }).lean()
  }
  public async updateUserVerificationStatus(data: FindEmailDTO): Promise<User | null> {
    const { email } = data;
    return await UserModel.findOneAndUpdate({ email }, { otpVerified: true }).lean()
  }
  public async forgotPassword(data: UpdatePasswordDTO): Promise<User | null> {
    const { email, password } = data;
    return await UserModel.findOneAndUpdate({ email }, { password: password }).lean()
  }
  public async createGoogleUser(data: CreateGoogleUserDTO): Promise<User> {
    return await UserModel.create(data)
  }
  public async findById(data: IdDTO): Promise<User | null> {
    const userData = await UserModel.findById({_id:data}).lean()
    return userData
  }
  public async changePassword(data: ChangePasswordDTO): Promise<User | null> {
    const { _id, newPassword } = data;
    return await UserModel.findByIdAndUpdate(_id, { password: newPassword }).lean()
  }
  public async updateUserProfile(
    data: UpdateUserDetailsDTO
  ): Promise<User | null> {
    const {
      _id,
      fname,
      lname,
      phone,
      profilePic,
      dateOfBirth,
      gender,
      age,
      height,
      weight,
      bloodGroup,
      medicalConditions,
      otherConcerns,
    } = data;

    return await UserModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          fname,
          lname,
          phone,
          profilePic,
          dateOfBirth,
          gender,
          age,
          height,
          weight,
          bloodGroup,
          medicalConditions,
          otherConcerns,
        },
      },
      { new: true }
    ).lean()
  }

  public async getUsers(data: GetUsersQueryDTO): Promise<{ usersList: User[], paginationData: PaginationDTO }> {
    const { page, limit, search, filters } = data;
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
  
    let matchQuery: any = {};
  
    if (data) {
      if (search) {
        matchQuery.$or = [
          { fname: { $regex: search, $options: "i" } },
          { lname: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }
  
      if (filters && filters.length > 0 && !filters.includes("All")) {
        const conditions: any = [];
  
        if (filters.includes("Block")) conditions.push({ isBlocked: true });
        if (filters.includes("Unblock")) conditions.push({ isBlocked: false });
        if (filters.includes("verified")) conditions.push({ $or: [{ otpVerified: true }, { googleVerified: true }] });
        if (filters.includes("Not verified")) conditions.push({ $and: [{ otpVerified: false }, { googleVerified: false }] });
  
        if (conditions.length > 0) matchQuery.$and = conditions;
      }
    }
  
    const totalCount = await UserModel.countDocuments({ role: "user", ...matchQuery });
    const usersList = await UserModel.find({ role: "user", ...matchQuery })
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .lean();
  
    const totalPages = Math.ceil(totalCount / limitNumber);
  
    return {
      usersList,
      paginationData: {
        currentPage: pageNumber ,
        totalPages: totalPages,
      },
    };
  }
  

  public async updateBlockStatus(data: UpdateBlockStatusDTO): Promise<User | null> {
    const { _id, isBlocked } = data;
    return await UserModel.findByIdAndUpdate(
      _id,
      { isBlocked: isBlocked },
      { new: true }
    ).lean()
  }

  public async countDocs(role:string):Promise<number> {
    return await UserModel.countDocuments({role:role})
  }

}
