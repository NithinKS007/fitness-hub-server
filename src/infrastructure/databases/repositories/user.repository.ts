import { PagedResponse } from "@application/dtos/utility-dtos";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import UserModel, { IUser } from "@infrastructure/databases/models/user.model";
import { GetTrainersDTO, GetUsersDTO } from "@application/dtos/query-dtos";
import { FilterQuery, Model } from "mongoose";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { User } from "@domain/entities/user.entity";
import { Trainer } from "@domain/entities/trainer.entity";
import { MongoHelper } from "../utils/mongo-helper";
import { ITrainer } from "../models/trainer.model";
import { TrainerMapper } from "@infrastructure/mappers/trainer.mapper";

export class UserRepository
  extends BaseRepository<IUser, User>
  implements IUserRepository
{
  constructor(
    model: Model<IUser> = UserModel,
    private trainerMapper: TrainerMapper = new TrainerMapper(),
    private utility: MongoHelper = new MongoHelper()
  ) {
    super(model);
  }

  async getUsers(dtos: GetUsersDTO): Promise<PagedResponse<User>> {
    const { page, limit, search, filters } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: FilterQuery<IUser> = {
      ...this.utility.search({ search }, ["fname", "lname", "email"]),
    };

    const filterMap: FilterQuery<IUser> = {
      Block: { isBlocked: true },
      Unblock: { isBlocked: false },
      verified: { $or: [{ otpVerified: true }, { googleVerified: true }] },
      "Not verified": {
        $and: [{ otpVerified: false }, { googleVerified: false }],
      },
    };

    const conditions =
      filters
        ?.filter((filter) => filter !== "All" && filter in filterMap)
        .map((filter) => filterMap[filter]) ?? [];

    if (conditions.length > 0) matchQuery.$and = conditions;

    const totalCount = await this.model.countDocuments({
      role: "user",
      ...matchQuery,
    });
    const usersList = await this.model
      .find({ role: "user", ...matchQuery })
      .select("-password")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });
    const toDomainList = usersList.map((user) => this.toDomain(user));
    return {
      data: toDomainList,
      pagination: paginationData,
    };
  }

  async getTrainers(dtos: GetTrainersDTO): Promise<
    PagedResponse<
      Omit<User, "password" | "createdAt" | "updatedAt"> & {
        trainerDetails: Omit<Trainer, "createdAt" | "updatedAt">;
      }
    >
  > {
    const {
      page,
      limit,
      search,
      filters,
      isApproved,
      isBlocked,
      experience,
      gender,
      sort,
      specialization,
    } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: any = {
      role: "trainer",
      ...this.utility.search({ search }, ["fname", "lname", "email"]),
      ...this.utility.applyInFilter(
        { filters: specialization },
        "trainerDetails.specializations"
      ),
      ...this.utility.applyInFilter(
        { filters: gender?.map((gen) => gen.toLowerCase()) },
        "gender"
      ),
    };

    const sortOptions: { [key: string]: { [key: string]: 1 | -1 } } = {
      "aA - zz": { fname: 1 },
      "zz - aa": { fname: -1 },
    };

    const sortQuery: { [key: string]: 1 | -1 } = sort
      ? sortOptions[sort]
      : { createdAt: -1 };

    const experienceMap: Record<string, Record<string, string>> = {
      "1-3": { $gte: "1", $lte: "3" },
      "3-5": { $gte: "3", $lte: "5" },
      "Greater than 5": { $gt: "5" },
      "Less than 1": { $lt: "1" },
    };

    const experienceConditions: FilterQuery<IUser & { trainerDetails: ITrainer }>[] =
      experience && experience.length > 0
        ? experience?.reduce<FilterQuery<IUser & { trainerDetails: ITrainer[] }>[]>(
            (acc, ex) => {
              const years = experienceMap[ex];
              if (years) {
                acc.push({ "trainerDetails.yearsOfExperience": years });
              }
              return acc;
            },
            []
          )
        : [];

    if (experienceConditions && experienceConditions.length > 0) {
      matchQuery.$or = experienceConditions;
    }

    const filterMap: FilterQuery<IUser> = {
      Block: { isBlocked: true },
      Unblock: { isBlocked: false },
      verified: { $or: [{ otpVerified: true }, { googleVerified: true }] },
      "Not verified": {
        $and: [{ otpVerified: false }, { googleVerified: false }],
      },
      Approved: { "trainerDetails.isApproved": true },
      "Not Approved": { "trainerDetails.isApproved": false },
    };

    const conditions: FilterQuery<IUser & { trainerDetails: ITrainer }> =
      filters && filters.length > 0
        ? filters?.reduce<FilterQuery<IUser & { trainerDetails: ITrainer[] }>>(
            (acc, filter) => {
              if (filter !== "All" && filter in filterMap) {
                acc.push(filterMap[filter]);
              }
              return acc;
            },
            []
          )
        : [];

    if (conditions && conditions.length > 0) matchQuery.$and = conditions;

    const trainerLookup = this.utility.lookup({
      from: "trainers",
      localField: "_id",
      foreignField: "userId",
      as: "trainerDetails",
    });

    const commonPipeline = [
      ...trainerLookup,
      {
        $match: {
          ...(isApproved !== undefined
            ? { "trainerDetails.isApproved": isApproved }
            : {}),
          ...(isBlocked !== undefined ? { isBlocked: isBlocked } : {}),
        },
      },
      { $match: matchQuery },
    ];

    const [totalCount, trainersList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([...commonPipeline])
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    const mappedData = trainersList.map((data) => this.trainerMapper.map(data));
    return {
      data: mappedData,
      pagination: paginationData,
    };
  }

  async countDocs(role: string): Promise<number> {
    return await this.model.countDocuments({ role: role });
  }
}
