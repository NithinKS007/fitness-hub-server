import mongoose from "mongoose";
import {
  CheckSubscriptionStatus,
  createUserSubscriptionPlanDTO,
  IdDTO,
  UpdateSubscriptionStatus,
} from "../../../application/dtos";
import { SubscriptionPlanEntity } from "../../../domain/entities/userSubscriptionPlanEntity";
import { UserSubscriptionPlanRepository } from "../../../domain/interfaces/userSubscriptionRepository";
import userSubscriptionPlanModel from "../models/userSubscriptionPlan";

export class MonogUserSubscriptionPlanRepository implements UserSubscriptionPlanRepository {
  public async create( data: createUserSubscriptionPlanDTO ): Promise<SubscriptionPlanEntity> {
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
      stripeSubscriptionStatus
      
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
      stripeSubscriptionStatus
    })

    return newSubscription.toObject()
  }
  public async findSubscriptionsOfUser(data: IdDTO): Promise<SubscriptionPlanEntity[] | null> {

    console.log("data received",data)
     const result =  await userSubscriptionPlanModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(data) } },
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
  public async findSubscriptionsOfUserwithUserIdAndTrainerId(data: CheckSubscriptionStatus): Promise<SubscriptionPlanEntity[] | null> {
    const { _id, trainerId } = data;
    const result = await userSubscriptionPlanModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(_id),
          trainerId: new mongoose.Types.ObjectId(trainerId)
        }
      }
    ]);
  
    return result.length > 0 ? result : null;
  }
  public async   findSubscriptionByStripeSubscriptionIdAndUpdateStatus(data: UpdateSubscriptionStatus): Promise<SubscriptionPlanEntity | null> {
    const { status,stripeSubscriptionId} = data;
    const result = await userSubscriptionPlanModel.findOneAndUpdate({stripeSubscriptionId:stripeSubscriptionId},{stripeSubscriptionStatus:status})
    return result
  }


}
