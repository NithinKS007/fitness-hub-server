import mongoose from "mongoose";
import {
  createUserSubscriptionPlanDTO,
  IdDTO,
} from "../../../application/dtos";
import { SubscriptionPlanEntity } from "../../../domain/entities/userSubscriptionPlanEntity";
import { UserSubscriptionPlanRepository } from "../../../domain/interfaces/userSubscriptionRepository";
import userSubscriptionPlanModel from "../models/userSubscriptionPlan";

export class MonogUserSubscriptionPlanRepository
  implements UserSubscriptionPlanRepository
{
  public async create(
    data: createUserSubscriptionPlanDTO
  ): Promise<SubscriptionPlanEntity> {
    const {
      userId,
      trainerId,
      subPeriod,
      price,
      durationInWeeks,
      sessionsPerWeek,
      totalSessions,
      stripePriceId,
      stripeSubscriptionId,
    } = data;
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
    })

    return newSubscription.toObject()
  }
  public async findSubscriptionsOfUser(
    data: IdDTO
  ): Promise<SubscriptionPlanEntity[] | null> {
     const result =  await userSubscriptionPlanModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(data) } },
      {
        $lookup: {
          from: "users",
          localField: "trainerId",
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
            _id:1,
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked:1
          },
        },
      },
    ]);

    console.log("result hello ",result)
    return result

  }
  public async findSubscriptionsOfTrainer(data: IdDTO): Promise<SubscriptionPlanEntity[] | null> {
    const result = await userSubscriptionPlanModel.aggregate([
      { $match: { trainerId : new mongoose.Types.ObjectId(data) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "subscribedUserData",
        },
      },
      { $unwind: "$subscribedUserData" },
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
          subscribedUserData: {
            _id:1,
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked:1
          },
        },
      },
    ]);
    console.log("subscription of trainer",result)
    return result
  }
  public async findSubscriptionByStripeSubscriptionId(data: IdDTO): Promise<SubscriptionPlanEntity> {
    const result = await userSubscriptionPlanModel.aggregate([
      { $match: { stripeSubscriptionId: data} },
      {
        $lookup: {
          from: "users",
          localField: "trainerId",
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
            _id:1,
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked:1
          },
        },
      },
    ]);
    return result[0]
  }

}
