import { FilterQuery, Model } from "mongoose";
import { CheckSubscriptionStatusDTO } from "@application/dtos/subscription-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import {
  DateRangeDTO,
  GetTrainerSubsDTO,
  GetUserSubDTO,
} from "@application/dtos/query-dtos";
import UserSubscriptionPlanModel, {
  IUserSubscriptionPlan,
} from "@infrastructure/databases/models/user-subscription-plan";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { UserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";
import {
  TRSubPeriodWiseCountMapper,
  TRSubPeriodWiseCountUI,
  TRSubStatusWiseCountMapper,
  TRSubStatusWiseCountUI,
} from "@infrastructure/mappers/chart.mappers";
import { MongoHelper } from "../utils/mongo-helper";
import {
  Top5TrainersMapper,
  Top5TrainesUILayer,
  TrainerSubMapper,
  TrainerSubsDBLayer,
  TrainerSubUILayer,
  UserSubMapper,
  UserSubsDBLayer,
  UserSubUILayer,
} from "@infrastructure/mappers/subscriptionPlan.mapper";

export class UserSubscriptionPlanRepository
  extends BaseRepository<IUserSubscriptionPlan, UserSubscriptionPlan>
  implements IUserSubscriptionPlanRepository
{
  private trainerPeriodSubCountMapper = new TRSubPeriodWiseCountMapper();
  private trainerSubStatusWiseCountMapper = new TRSubStatusWiseCountMapper();
  private trainerSubMapper = new TrainerSubMapper();
  private userSubMapper = new UserSubMapper();
  private top5TrainersMapper = new Top5TrainersMapper();

  constructor(
    model: Model<IUserSubscriptionPlan> = UserSubscriptionPlanModel,
    private utility: MongoHelper = new MongoHelper()
  ) {
    super(model);
  }

  private projSubPlan() {
    return {
      _id: 1,
      durationInWeeks: 1,
      price: 1,
      sessionsPerWeek: 1,
      providerPriceId: 1,
      providerSubId: 1,
      providerSubStatus: 1,
      subPeriod: 1,
      totalSessions: 1,
      trainerId: 1,
      userId: 1,
    };
  }

  private async countSubscribersByStatus(
    trainerId: string,
    status?: string
  ): Promise<number> {
    const result = await this.model.aggregate([
      {
        $match: {
          trainerId: this.parseId(trainerId),
          ...(status ? { providerSubStatus: status } : {}),
        },
      },
      {
        $count: "count",
      },
    ]);

    return result.length > 0 ? result[0].count : 0;
  }

  async getUserSubscriptions(
    dtos: GetUserSubDTO
  ): Promise<PagedResponse<UserSubUILayer>> {
    const { userId, page, limit, search, filters } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: FilterQuery<UserSubsDBLayer> = {
      ...this.utility.search({ search }, [
        "trainerData.fname",
        "trainerData.lname",
        "trainerData.email",
      ]),
    };

    const conditions = this.utility.subFilter(filters);
    if (conditions && conditions.length > 0) matchQuery.$or = conditions;

    const trainerLookup = this.utility.lookup({
      from: "users",
      localField: "trainerId",
      foreignField: "_id",
      as: "trainerData",
    });

    const commonPipeline = [
      { $match: { userId: this.parseId(userId) } },
      ...trainerLookup,
      { $match: matchQuery },
    ];

    const projFields = {
      ...this.projSubPlan(),
      ...this.utility.trainerProj(),
    };

    const [totalCount, userSubscriptionsList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: projFields,
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    const mappedData = userSubscriptionsList.map((data) =>
      this.userSubMapper.map(data)
    );

    return {
      data: mappedData,
      pagination: paginationData,
    };
  }

  async getTrainerSubscriptions(
    dtos: GetTrainerSubsDTO
  ): Promise<PagedResponse<TrainerSubUILayer>> {
    const { trainerId, page, limit, search, filters } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: FilterQuery<TrainerSubsDBLayer> = {
      ...this.utility.search({ search }, [
        "userData.fname",
        "userData.lname",
        "userData.email",
      ]),
    };

    const conditions = this.utility.subFilter(filters);
    if (conditions && conditions.length > 0) matchQuery.$or = conditions;

    const userLookup = this.utility.lookup({
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userData",
    });

    const commonPipeline = [
      { $match: { trainerId: this.parseId(trainerId) } },
      ...userLookup,
      { $match: matchQuery },
    ];

    const projFields = {
      ...this.projSubPlan(),
      ...this.utility.userProj(),
    };
    const [totalCount, trainerSubscribers] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),

      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: projFields,
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    const mappedData = trainerSubscribers.map((data) =>
      this.trainerSubMapper.map(data)
    );
    return {
      data: mappedData,
      pagination: paginationData,
    };
  }

  async getLatestPlan(
    dtos: CheckSubscriptionStatusDTO
  ): Promise<UserSubscriptionPlan | null> {
    const { userId, trainerId } = dtos;
    const result = await this.model
      .findOne({
        userId: this.parseId(userId),
        trainerId: this.parseId(trainerId),
      })
      .sort({ updatedAt: -1 });

    return result ? this.toDomain(result) : null;
  }

  async countAllTrainerSubscribers(trainerId: string): Promise<number> {
    return this.countSubscribersByStatus(trainerId);
  }

  async countAllActiveSubscribers(trainerId: string): Promise<number> {
    return this.countSubscribersByStatus(trainerId, "active");
  }

  async countCanceledSubscribers(trainerId: string): Promise<number> {
    return this.countSubscribersByStatus(trainerId, "canceled");
  }

  async getTrainerSubStatusWiseCount(
    trainerId: string,
    { startDate, endDate }: DateRangeDTO
  ): Promise<TRSubStatusWiseCountUI[]> {
    const result = await this.model.aggregate([
      {
        $match: {
          trainerId: this.parseId(trainerId),
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$createdAt",
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ["$providerSubStatus", "active"] }, 1, 0],
            },
          },
          canceled: {
            $sum: {
              $cond: [{ $eq: ["$providerSubStatus", "canceled"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return result.map((data) => this.trainerSubStatusWiseCountMapper.map(data));
  }

  async getTrainerSubPeriodWiseCount(
    trainerId: string,
    { startDate, endDate }: DateRangeDTO
  ): Promise<TRSubPeriodWiseCountUI[]> {
    const result = await this.model.aggregate([
      {
        $match: {
          trainerId: this.parseId(trainerId),
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$subPeriod",
          value: { $sum: 1 },
        },
      },
    ]);

    return result.map((data) => this.trainerPeriodSubCountMapper.map(data));
  }

  async getTop5TrainersBySubscribers(): Promise<Top5TrainesUILayer[]> {
    const trainerLookup = this.utility.lookup({
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "trainerData",
    });

    const result = await this.model.aggregate([
      {
        $group: {
          _id: "$trainerId",
          totalActiveSubscriptions: {
            $sum: {
              $cond: [{ $eq: ["$providerSubStatus", "active"] }, 1, 0],
            },
          },
          totalCanceledSubscriptions: {
            $sum: {
              $cond: [{ $eq: ["$providerSubStatus", "canceled"] }, 1, 0],
            },
          },
          totalSubscriptions: { $sum: 1 },
        },
      },
      ...trainerLookup,
      {
        $project: {
          _id: 1,
          fname: "$trainerData.fname",
          lname: "$trainerData.lname",
          email: "$trainerData.email",
          totalActiveSubscriptions: 1,
          totalCanceledSubscriptions: 1,
          totalSubscriptions: 1,
        },
      },
      { $sort: { totalSubscriptions: -1 } },
      { $limit: 5 },
    ]);
    const mappedData = result.map((data) => this.top5TrainersMapper.map(data));
    return mappedData;
  }
}
