import { UpdateBlockStatusDTO } from "../../../application/dtos/auth-dtos";

import {
  ChangePasswordDTO,
  FindEmailDTO,
  UpdatePasswordDTO,
} from "../../../application/dtos/auth-dtos";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utility-dtos";

import {
  CreateGoogleUserDTO,
  CreateUserDTO,
  UpdateUserDetailsDTO,
} from "../../../application/dtos/user-dtos";
import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import UserModel from "../models/userModel";
import { GetUsersQueryDTO } from "../../../application/dtos/query-dtos";
import mongoose from "mongoose";

export class MongoUserRepository implements IUserRepository {
  public async create(createUser: CreateUserDTO): Promise<User> {
    const userData = await UserModel.create(createUser);
    return userData.toObject();
  }
  public async findByEmail({ email }: FindEmailDTO): Promise<User | null> {
    return await UserModel.findOne({ email }).lean();
  }
  public async updateUserVerificationStatus({
    email,
  }: FindEmailDTO): Promise<User | null> {
    return await UserModel.findOneAndUpdate(
      { email },
      { otpVerified: true }
    ).lean();
  }
  public async forgotPassword({
    email,
    password,
  }: UpdatePasswordDTO): Promise<User | null> {
    return await UserModel.findOneAndUpdate(
      { email },
      { password: password }
    ).lean();
  }
  public async createGoogleUser(data: CreateGoogleUserDTO): Promise<User> {
    return await UserModel.create(data);
  }
  public async findById(userId: IdDTO): Promise<User | null> {
    const userData = await UserModel.findById({ _id: userId }).lean();
    return userData;
  }
  public async changePassword({
    userId,
    newPassword,
  }: ChangePasswordDTO): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(userId, {
      password: newPassword,
    }).lean();
  }
  public async updateUserProfile({
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

  public async getUsers({
    page,
    limit,
    search,
    filters,
  }: GetUsersQueryDTO): Promise<{
    usersList: User[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
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

  public async updateBlockStatus({
    userId,
    isBlocked,
  }: UpdateBlockStatusDTO): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      { isBlocked: isBlocked },
      { new: true }
    ).lean();
  }

  public async countDocs(role: string): Promise<number> {
    return await UserModel.countDocuments({ role: role });
  }
}
