import mongoose from "mongoose";
import {
  CheckSubscriptionStatusDTO,
  CreateUserSubscriptionPlanDTO,
  UpdateSubscriptionStatusDTO,
} from "../../../application/dtos/subscription-dtos";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utility-dtos";
import { SubscriptionPlanEntity } from "../../../domain/entities/SubscriptionPlan";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import userSubscriptionPlanModel from "../models/userSubscriptionPlan";
import {
  DateRangeQueryDTO,
  GetTrainerSubscribersQueryDTO,
  GetUserSubscriptionsQueryDTO,
  GetUserTrainersListQueryDTO,
} from "../../../application/dtos/query-dtos";
import {
  TrainerSubscriberRecord,
  UserMyTrainersList,
  UserSubscriptionRecord,
} from "../../../domain/entities/subscription";
import {
  TrainerChartData,
  TrainerPieChartData,
} from "../../../domain/entities/chart";
import { Top5List } from "../../../domain/entities/trainer";
import conversationModel from "../models/conversation";

export class MongoUserSubscriptionPlanRepository
  implements IUserSubscriptionPlanRepository
{
  public async create({
    userId,
    trainerId,
    subPeriod,
    price,
    durationInWeeks,
    sessionsPerWeek,
    totalSessions,
    stripePriceId,
    stripeSubscriptionId,
    stripeSubscriptionStatus,
  }: CreateUserSubscriptionPlanDTO): Promise<SubscriptionPlanEntity> {
    const newSubscription = await userSubscriptionPlanModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      trainerId: new mongoose.Types.ObjectId(trainerId),
      subPeriod,
      price,
      durationInWeeks,
      sessionsPerWeek,
      totalSessions,
      stripePriceId,
      stripeSubscriptionId,
      stripeSubscriptionStatus,
    });

    return newSubscription.toObject();
  }
  public async findSubscriptionsOfUser(
    userId: IdDTO,
    { page, limit, search, filters }: GetUserSubscriptionsQueryDTO
  ): Promise<{
    userSubscriptionRecord: UserSubscriptionRecord[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { "subscribedTrainerData.fname": { $regex: search, $options: "i" } },
        { "subscribedTrainerData.lname": { $regex: search, $options: "i" } },
        { "subscribedTrainerData.email": { $regex: search, $options: "i" } },
      ];
    }

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions: any = [];
      if (filters.includes("Active"))
        conditions.push({ stripeSubscriptionStatus: "active" });
      if (filters.includes("Canceled"))
        conditions.push({ stripeSubscriptionStatus: "canceled" });
      if (filters.includes("Incomplete"))
        conditions.push({ stripeSubscriptionStatus: "incomplete" });
      if (filters.includes("Incomplete expired"))
        conditions.push({ stripeSubscriptionStatus: "incomplete_expired" });
      if (filters.includes("Trialing"))
        conditions.push({ stripeSubscriptionStatus: "trialing" });
      if (filters.includes("Past due"))
        conditions.push({ stripeSubscriptionStatus: "past_due" });
      if (filters.includes("Unpaid"))
        conditions.push({ stripeSubscriptionStatus: "unpaid" });
      if (filters.includes("Paused"))
        conditions.push({ stripeSubscriptionStatus: "paused" });
      if (filters.includes("Monthly"))
        conditions.push({ subPeriod: "monthly" });
      if (filters.includes("Quarterly"))
        conditions.push({ subPeriod: "quarterly" });
      if (filters.includes("Yearly")) conditions.push({ subPeriod: "yearly" });
      if (filters.includes("HalfYearly"))
        conditions.push({ subPeriod: "halfYearly" });
      if (conditions.length > 0) matchQuery.$or = conditions;
    }

    const [totalCount, userSubscriptionsList] = await Promise.all([
      userSubscriptionPlanModel
        .aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
          { $count: "totalCount" },
        ])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      userSubscriptionPlanModel
        .aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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

    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      userSubscriptionRecord: userSubscriptionsList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }
  public async findSubscriptionsOfTrainer(
    trainerId: IdDTO,
    { page, limit, search, filters }: GetTrainerSubscribersQueryDTO
  ): Promise<{
    trainerSubscriberRecord: TrainerSubscriberRecord[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { "subscribedUserData.fname": { $regex: search, $options: "i" } },
        { "subscribedUserData.lname": { $regex: search, $options: "i" } },
        { "subscribedUserData.email": { $regex: search, $options: "i" } },
      ];
    }

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions: any = [];
      if (filters.includes("Active"))
        conditions.push({ stripeSubscriptionStatus: "active" });
      if (filters.includes("Canceled"))
        conditions.push({ stripeSubscriptionStatus: "canceled" });
      if (filters.includes("Incomplete"))
        conditions.push({ stripeSubscriptionStatus: "incomplete" });
      if (filters.includes("Incomplete expired"))
        conditions.push({ stripeSubscriptionStatus: "incomplete_expired" });
      if (filters.includes("Trialing"))
        conditions.push({ stripeSubscriptionStatus: "trialing" });
      if (filters.includes("Past due"))
        conditions.push({ stripeSubscriptionStatus: "past_due" });
      if (filters.includes("Unpaid"))
        conditions.push({ stripeSubscriptionStatus: "unpaid" });
      if (filters.includes("Paused"))
        conditions.push({ stripeSubscriptionStatus: "paused" });
      if (filters.includes("Monthly"))
        conditions.push({ subPeriod: "monthly" });
      if (filters.includes("Quarterly"))
        conditions.push({ subPeriod: "quarterly" });
      if (filters.includes("Yearly")) conditions.push({ subPeriod: "yearly" });
      if (filters.includes("HalfYearly"))
        conditions.push({ subPeriod: "halfYearly" });
      if (conditions.length > 0) matchQuery.$or = conditions;
    }

    const [totalCount, trainerSubscribers] = await Promise.all([
      userSubscriptionPlanModel
        .aggregate([
          { $match: { trainerId: new mongoose.Types.ObjectId(trainerId) } },
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
          { $count: "totalCount" },
        ])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),

      userSubscriptionPlanModel
        .aggregate([
          { $match: { trainerId: new mongoose.Types.ObjectId(trainerId) } },
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

    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      trainerSubscriberRecord: trainerSubscribers,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }
  public async findSubscriptionByStripeSubscriptionId(
    stripeSubscriptionId: IdDTO
  ): Promise<SubscriptionPlanEntity> {
    const result = await userSubscriptionPlanModel.aggregate([
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
  public async findSubscriptionsOfUserwithUserIdAndTrainerId({
    userId,
    trainerId,
  }: CheckSubscriptionStatusDTO): Promise<SubscriptionPlanEntity[] | null> {
    const result = await userSubscriptionPlanModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          trainerId: new mongoose.Types.ObjectId(trainerId),
        },
      },
    ]);

    return result.length > 0 ? result : null;
  }
  public async findSubscriptionByStripeSubscriptionIdAndUpdateStatus({
    status,
    stripeSubscriptionId,
  }: UpdateSubscriptionStatusDTO): Promise<SubscriptionPlanEntity | null> {
    const result = await userSubscriptionPlanModel.findOneAndUpdate(
      { stripeSubscriptionId: stripeSubscriptionId },
      { stripeSubscriptionStatus: status }
    );
    return result;
  }

  public async countAllTrainerSubscribers(trainerId: IdDTO): Promise<number> {
    const result = await userSubscriptionPlanModel.aggregate([
      {
        $match: {
          trainerId: new mongoose.Types.ObjectId(trainerId),
        },
      },
      {
        $count: "totalSubscribers",
      },
    ]);

    return result.length > 0 ? result[0].totalSubscribers : 0;
  }

  public async countAllActiveSubscribers(trainerId: IdDTO): Promise<number> {
    const result = await userSubscriptionPlanModel.aggregate([
      {
        $match: {
          trainerId: new mongoose.Types.ObjectId(trainerId),
          stripeSubscriptionStatus: "active",
        },
      },
      {
        $count: "activeCount",
      },
    ]);

    return result.length > 0 ? result[0].activeCount : 0;
  }

  public async countCanceledSubscribers(trainerId: IdDTO): Promise<number> {
    const result = await userSubscriptionPlanModel.aggregate([
      {
        $match: {
          trainerId: new mongoose.Types.ObjectId(trainerId),
          stripeSubscriptionStatus: "canceled",
        },
      },
      {
        $count: "canceledCount",
      },
    ]);

    return result.length > 0 ? result[0].canceledCount : 0;
  }

  public async trainerChartDataFilter(
    trainerId: IdDTO,
    { startDate, endDate }: DateRangeQueryDTO
  ): Promise<TrainerChartData[]> {
    const result = await userSubscriptionPlanModel.aggregate([
      {
        $match: {
          trainerId: new mongoose.Types.ObjectId(trainerId),
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
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

  public async trainerPieChartDataFilter(
    trainerId: IdDTO,
    { startDate, endDate }: DateRangeQueryDTO
  ): Promise<TrainerPieChartData[]> {
    const result = await userSubscriptionPlanModel.aggregate([
      {
        $match: {
          trainerId: new mongoose.Types.ObjectId(trainerId),
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
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

  public async usersMyTrainersList(
    userId: IdDTO,
    { page, limit, search }: GetUserTrainersListQueryDTO
  ): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let matchQuery: any = {};

    if (search) {
      matchQuery.$or = [
        { "subscribedTrainerData.fname": { $regex: search, $options: "i" } },
        { "subscribedTrainerData.lname": { $regex: search, $options: "i" } },
        { "subscribedTrainerData.email": { $regex: search, $options: "i" } },
      ];
    }

    const [totalCount, userTrainersList] = await Promise.all([
      conversationModel
        .aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId) } },
          { $sort: { updatedAt: -1 } },
          {
            $lookup: {
              from: "trainers",
              localField: "trainerId",
              foreignField: "_id",
              as: "trainerData",
            },
          },
          {
            $unwind: "$trainerData",
          },
          {
            $lookup: {
              from: "users",
              localField: "trainerData.userId",
              foreignField: "_id",
              as: "subscribedTrainerData",
            },
          },
          { $match: matchQuery },
          { $unwind: "$subscribedTrainerData" },
          { $count: "totalCount" },
        ])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      conversationModel
        .aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId) } },
          { $sort: { updatedAt: -1 } },
          {
            $lookup: {
              from: "trainers",
              localField: "trainerId",
              foreignField: "_id",
              as: "trainerData",
            },
          },
          {
            $unwind: "$trainerData",
          },
          {
            $lookup: {
              from: "users",
              localField: "trainerData.userId",
              foreignField: "_id",
              as: "subscribedTrainerData",
            },
          },
          { $match: matchQuery },
          {
            $unwind: "$subscribedTrainerData",
          },
          {
            $project: {
              _id: 1,
              stripeSubscriptionStatus: 1,
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
    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      userTrainersList: userTrainersList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  public async findTop5TrainersWithHighestSubscribers(): Promise<Top5List[]> {
    const result = await userSubscriptionPlanModel.aggregate([
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
