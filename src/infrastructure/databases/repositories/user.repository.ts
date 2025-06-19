import { FindEmailDTO, UpdatePasswordDTO } from "@application/dtos/auth-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import UserModel from "@infrastructure/databases/models/user.model";
import { GetUsersQueryDTO } from "@application/dtos/query-dtos";
import { Model } from "mongoose";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { IUser } from "@domain/entities/user.entity";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor( model: Model<IUser> = UserModel) {
    super(model);
  }

  async updateUserVerificationStatus({
    email,
  }: FindEmailDTO): Promise<IUser | null> {
    return await this.model
      .findOneAndUpdate({ email }, { otpVerified: true })
      .lean();
  }

  async forgotPassword({
    email,
    password,
  }: UpdatePasswordDTO): Promise<IUser | null> {
    return await this.model
      .findOneAndUpdate({ email }, { password: password })
      .lean();
  }

  async getUsers({ page, limit, search, filters }: GetUsersQueryDTO): Promise<{
    usersList: IUser[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

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

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    return {
      usersList,
      paginationData,
    };
  }

  async countDocs(role: string): Promise<number> {
    return await this.model.countDocuments({ role: role });
  }
}
