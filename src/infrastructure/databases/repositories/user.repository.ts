import {
  FindEmailDTO,
  UpdatePasswordDTO,
} from "../../../application/dtos/auth-dtos";
import { PaginationDTO } from "../../../application/dtos/utility-dtos";
import { User } from "../../../domain/entities/user.entities";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import UserModel, { IUser } from "../models/user.model";
import { GetUsersQueryDTO } from "../../../application/dtos/query-dtos";
import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor(model: Model<IUser> = UserModel) {
    super(model);
  }

  async updateUserVerificationStatus({
    email,
  }: FindEmailDTO): Promise<User | null> {
    return await this.model
      .findOneAndUpdate({ email }, { otpVerified: true })
      .lean();
  }
  
  async forgotPassword({
    email,
    password,
  }: UpdatePasswordDTO): Promise<User | null> {
    return await this.model
      .findOneAndUpdate({ email }, { password: password })
      .lean();
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

    const totalCount = await this.model.countDocuments({
      role: "user",
      ...matchQuery,
    });
    const usersList = await this.model
      .find({ role: "user", ...matchQuery })
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

  async countDocs(role: string): Promise<number> {
    return await this.model.countDocuments({ role: role });
  }
}
