import {
  CertificationsDTO,
  changePasswordDTO,
  CreateGoogleUserDTO,
  CreateUserDTO,
  FindEmailDTO,
  IdDTO,
  Role,
  SpecializationsDTO,
  trainerVerification,
  updateBlockStatus,
  UpdatePassword,
  UpdateUserDetails,
} from "../../../application/dtos";
import { User } from "../../../domain/entities/userEntity";
import { UserRepository } from "../../../domain/interfaces/userRepository";
import UserModel from "../models/userModel";

export class MongoUserRepository implements UserRepository {
  public async create(data: CreateUserDTO): Promise<User> {
    const userData = await UserModel.create(data);
    return userData.toObject()
  }
  public async findByEmail(data: FindEmailDTO): Promise<User | null> {
    const { email } = data;
    return await UserModel.findOne({ email })
  }
  public async updateUserVerificationStatus(data: FindEmailDTO): Promise<User | null> {
    const { email } = data;
    return await UserModel.findOneAndUpdate({ email }, { otpVerified: true })
  }
  public async forgotPassword(data: UpdatePassword): Promise<User | null> {
    const { email, password } = data;
    return await UserModel.findOneAndUpdate({ email }, { password: password })
  }
  public async createGoogleUser(data: CreateGoogleUserDTO): Promise<User> {
    return await UserModel.create(data);
  }
  public async findById(data: IdDTO): Promise<User | null> {
    const userData = await UserModel.findById({_id:data}).lean()
    return userData
  }
  public async changePassword(data: changePasswordDTO): Promise<User | null> {
    const { _id, newPassword } = data;
    return await UserModel.findByIdAndUpdate(_id, { password: newPassword })
  }
  public async updateUserProfile(
    data: UpdateUserDetails
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
    )
  }

  public async getUsers(): Promise<User[]> {
    return await UserModel.find({ role: "user" }).sort({ createdAt: -1 })
  }
  public async updateBlockStatus(data: updateBlockStatus): Promise<User | null> {
    const { _id, isBlocked } = data;
    return await UserModel.findByIdAndUpdate(
      _id,
      { isBlocked: isBlocked },
      { new: true }
    )
  }


}
