import { Model } from "mongoose";
import {
  CheckSubscriptionStatusDTO,
  TrainerSubscriberRecord,
  UpdateSubscriptionStatusDTO,
  UserSubscriptionRecord,
} from "@application/dtos/subscription-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import {
  DateRangeQueryDTO,
  GetTrainerSubscribersQueryDTO,
  GetUserSubscriptionsQueryDTO,
} from "@application/dtos/query-dtos";
import UserSubscriptionPlanModel from "@infrastructure/databases/models/user-subscription-plan";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import {
  TrainerChartData,
  TrainerPieChartData,
} from "@application/dtos/chart-dtos";
import { Top5List } from "@application/dtos/trainer-dtos";
import { IUserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";

export class UserSubscriptionPlanRepository
  extends BaseRepository<IUserSubscriptionPlan>
  implements IUserSubscriptionPlanRepository
{
  constructor(model: Model<IUserSubscriptionPlan> = UserSubscriptionPlanModel) {
    super(model);
  }

  private subStatusFilterCriteria(filters: string[]) {
    const statusFilters: { [key: string]: string } = {
      Active: "active",
      Canceled: "canceled",
      Incomplete: "incomplete",
      "Incomplete expired": "incomplete_expired",
      Trialing: "trialing",
      "Past due": "past_due",
      Unpaid: "unpaid",
      Paused: "paused",
    };

    const periodFilters: { [key: string]: string } = {
      Monthly: "monthly",
      Quarterly: "quarterly",
      Yearly: "yearly",
      HalfYearly: "halfYearly",
    };

    type Condition =
      | { stripeSubscriptionStatus: string }
      | { subPeriod: string };

    const conditions = filters.reduce<Condition[]>((acc, filter) => {
      if (statusFilters[filter]) {
        acc.push({ stripeSubscriptionStatus: statusFilters[filter] });
      }

      if (periodFilters[filter]) {
        acc.push({ subPeriod: periodFilters[filter] });
      }
      return acc;
    }, []);

    return conditions;
  }

  private async countSubscribersByStatus(
    trainerId: string,
    status?: string
  ): Promise<number> {
    const result = await this.model.aggregate([
      {
        $match: {
          trainerId: this.parseId(trainerId),
          ...(status ? { stripeSubscriptionStatus: status } : {}),
        },
      },
      {
        $count: "count",
      },
    ]);

    return result.length > 0 ? result[0].count : 0;
  }

  async getUserSubscriptions(
    userId: string,
    { page, limit, search, filters }: GetUserSubscriptionsQueryDTO
  ): Promise<{
    userSubscriptionRecord: UserSubscriptionRecord[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { "subscribedTrainerData.fname": { $regex: search, $options: "i" } },
        { "subscribedTrainerData.lname": { $regex: search, $options: "i" } },
        { "subscribedTrainerData.email": { $regex: search, $options: "i" } },
      ];
    }

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions = this.subStatusFilterCriteria(filters);

      if (conditions.length > 0) matchQuery.$or = conditions;
    }

    const commonPipeline = [
      { $match: { userId: this.parseId(userId) } },
      {
        $lookup: {
          from: "trainers",
          localField: "trainerId",
          foreignField: "_id",
          as: "subscribedTrainerData",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscribedTrainerData.userId",
          foreignField: "_id",
          as: "subscribedTrainerData",
        },
      },
      { $match: matchQuery },
      { $unwind: "$subscribedTrainerData" },
    ];

    const [totalCount, userSubscriptionsList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: {
              _id: 1,
              durationInWeeks: 1,
              price: 1,
              sessionsPerWeek: 1,
              stripePriceId: 1,
              stripeSubscriptionId: 1,
              stripeSubscriptionStatus: 1,
              subPeriod: 1,
              totalSessions: 1,
              trainerId: 1,
              userId: 1,
              subscribedTrainerData: {
                _id: 1,
                fname: 1,
                lname: 1,
                email: 1,
                profilePic: 1,
                isBlocked: 1,
              },
            },
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
    return {
      userSubscriptionRecord: userSubscriptionsList,
      paginationData,
    };
  }

  async getTrainerSubscriptions(
    trainerId: string,
    { page, limit, search, filters }: GetTrainerSubscribersQueryDTO
  ): Promise<{
    trainerSubscriberRecord: TrainerSubscriberRecord[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { "subscribedUserData.fname": { $regex: search, $options: "i" } },
        { "subscribedUserData.lname": { $regex: search, $options: "i" } },
        { "subscribedUserData.email": { $regex: search, $options: "i" } },
      ];
    }

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions = this.subStatusFilterCriteria(filters);

      if (conditions.length > 0) matchQuery.$or = conditions;
    }

    const commonPipeline = [
      { $match: { trainerId: this.parseId(trainerId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "subscribedUserData",
        },
      },
      { $match: matchQuery },
      { $unwind: "$subscribedUserData" },
    ];

    const [totalCount, trainerSubscribers] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),

      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: {
              _id: 1,
              durationInWeeks: 1,
              price: 1,
              sessionsPerWeek: 1,
              stripePriceId: 1,
              stripeSubscriptionStatus: 1,
              stripeSubscriptionId: 1,
              subPeriod: 1,
              totalSessions: 1,
              trainerId: 1,
              userId: 1,
              subscribedUserData: {
                _id: 1,
                fname: 1,
                lname: 1,
                email: 1,
                profilePic: 1,
                isBlocked: 1,
              },
            },
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
    return {
      trainerSubscriberRecord: trainerSubscribers,
      paginationData,
    };
  }

  async getSubscriptionByStripeId(
    stripeSubscriptionId: string
  ): Promise<IUserSubscriptionPlan> {
    const result = await this.model.aggregate([
      { $match: { stripeSubscriptionId: stripeSubscriptionId } },
      {
        $lookup: {
          from: "trainers",
          localField: "trainerId",
          foreignField: "_id",
          as: "trainerData",
        },
      },
      { $unwind: "$trainerData" },
      {
        $lookup: {
          from: "users",
          localField: "trainerData.userId",
          foreignField: "_id",
          as: "subscribedTrainerData",
        },
      },
      { $unwind: "$subscribedTrainerData" },
      {
        $project: {
          _id: 1,
          durationInWeeks: 1,
          price: 1,
          sessionsPerWeek: 1,
          stripePriceId: 1,
          stripeSubscriptionId: 1,
          subPeriod: 1,
          totalSessions: 1,
          trainerId: 1,
          userId: 1,
          subscribedTrainerData: {
            _id: 1,
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked: 1,
          },
        },
      },
    ]);
    return result[0];
  }
  async getSubscriptionsByUserAndTrainerId({
    userId,
    trainerId,
  }: CheckSubscriptionStatusDTO): Promise<IUserSubscriptionPlan[] | null> {
    const result = await this.model.aggregate([
      {
        $match: {
          userId: this.parseId(userId),
          trainerId: this.parseId(trainerId),
        },
      },
    ]);

    return result.length > 0 ? result : null;
  }

  async updateSubscriptionStatusByStripeId({
    status,
    stripeSubscriptionId,
  }: UpdateSubscriptionStatusDTO): Promise<IUserSubscriptionPlan | null> {
    const result = await this.model.findOneAndUpdate(
      { stripeSubscriptionId: stripeSubscriptionId },
      { stripeSubscriptionStatus: status },
      { new: true }
    );
    return result;
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

  async getTrainerLineChartData(
    trainerId: string,
    { startDate, endDate }: DateRangeQueryDTO
  ): Promise<TrainerChartData[]> {
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
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ["$stripeSubscriptionStatus", "active"] }, 1, 0],
            },
          },
          canceled: {
            $sum: {
              $cond: [{ $eq: ["$stripeSubscriptionStatus", "canceled"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return result;
  }

  async getTrainerPieChartData(
    trainerId: string,
    { startDate, endDate }: DateRangeQueryDTO
  ): Promise<TrainerPieChartData[]> {
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

    return result;
  }

  async getTop5TrainersBySubscribers(): Promise<Top5List[]> {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: "$trainerId",
          totalActiveSubscriptions: {
            $sum: {
              $cond: [{ $eq: ["$stripeSubscriptionStatus", "active"] }, 1, 0],
            },
          },
          totalCanceledSubscriptions: {
            $sum: {
              $cond: [{ $eq: ["$stripeSubscriptionStatus", "canceled"] }, 1, 0],
            },
          },
          totalSubscriptions: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "trainers",
          localField: "_id",
          foreignField: "_id",
          as: "trainerCollectionData",
        },
      },
      { $unwind: "$trainerCollectionData" },
      {
        $lookup: {
          from: "users",
          localField: "trainerCollectionData.userId",
          foreignField: "_id",
          as: "trainerData",
        },
      },
      { $unwind: "$trainerData" },
      {
        $project: {
          fname: "$trainerData.fname",
          lname: "$trainerData.lname",
          email: "$trainerData.email",
          _id: 1,
          totalActiveSubscriptions: 1,
          totalCanceledSubscriptions: 1,
          totalSubscriptions: 1,
        },
      },
      { $sort: { totalSubscriptions: -1 } },
      { $limit: 5 },
    ]);
    return result;
  }
}
