import { UpdateBlockStatusDTO } from "../../../application/dtos/auth-dtos";

import {
  ChangePasswordDTO,
  FindEmailDTO,
  UpdatePasswordDTO,
} from "../../../application/dtos/auth-dtos";
import { PaginationDTO } from "../../../application/dtos/utility-dtos";

import {
  CreateGoogleUserDTO,
  CreateUserDTO,
  UpdateUserDetailsDTO,
} from "../../../application/dtos/user-dtos";
import { User } from "../../../domain/entities/user.entities";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import UserModel, { IUser } from "../models/user.model";
import { GetUsersQueryDTO } from "../../../application/dtos/query-dtos";
import mongoose, { Model } from "mongoose";
import { BaseRepository } from "./base.repository";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor(model: Model<IUser> = UserModel) {
    super(model);
  }

  // async create(createUser: CreateUserDTO): Promise<User> {
  //   const userData = await UserModel.create(createUser);
  //   return userData.toObject();
  // }
  async findByEmail({ email }: FindEmailDTO): Promise<User | null> {
    return await UserModel.findOne({ email }).lean();
  }
  async updateUserVerificationStatus({
    email,
  }: FindEmailDTO): Promise<User | null> {
    return await UserModel.findOneAndUpdate(
      { email },
      { otpVerified: true }
    ).lean();
  }
  async forgotPassword({
    email,
    password,
  }: UpdatePasswordDTO): Promise<User | null> {
    return await UserModel.findOneAndUpdate(
      { email },
      { password: password }
    ).lean();
  }
  async createGoogleUser(data: CreateGoogleUserDTO): Promise<User> {
    return await UserModel.create(data);
  }
  // async findById(userId: string): Promise<User | null> {
  //   const userData = await UserModel.findById({ _id: userId }).lean();
  //   return userData;
  // }
  async changePassword({
    userId,
    newPassword,
  }: ChangePasswordDTO): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(userId, {
      password: newPassword,
    }).lean();
  }
  async updateUserProfile({
    userId,
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
  }: UpdateUserDetailsDTO): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
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
    ).lean();
  }

  async getUsers({ page, limit, search, filters }: GetUsersQueryDTO): Promise<{
    usersList: User[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let matchQuery: any = {};

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
      if (filters.includes("verified"))
        conditions.push({
          $or: [{ otpVerified: true }, { googleVerified: true }],
        });
      if (filters.includes("Not verified"))
        conditions.push({
          $and: [{ otpVerified: false }, { googleVerified: false }],
        });

      if (conditions.length > 0) matchQuery.$and = conditions;
    }

    const totalCount = await UserModel.countDocuments({
      role: "user",
      ...matchQuery,
    });
    const usersList = await UserModel.find({ role: "user", ...matchQuery })
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .lean();

    const totalPages = Math.ceil(totalCount / limitNumber);

    return {
      usersList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  async updateBlockStatus({
    userId,
    isBlocked,
  }: UpdateBlockStatusDTO): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      { isBlocked: isBlocked },
      { new: true }
    ).lean();
  }

  async countDocs(role: string): Promise<number> {
    return await UserModel.countDocuments({ role: role });
  }
}
