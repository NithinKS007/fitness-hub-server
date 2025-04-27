import mongoose from "mongoose";
import {
  CreateSubscriptionDTO,
  FindExistingSubscriptionDTO,
  UpdateSubscriptionBlockStatusDTO,
  UpdateSubscriptionDetailsDTO,
} from "../../../application/dtos/subscriptionDTOs";
import { IdDTO } from "../../../application/dtos/utilityDTOs";
import { Subscription } from "../../../domain/entities/subscription";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import SubscriptionModel from "../models/subscriptionModel";

export class MongoSubscriptionRepository implements ISubscriptionRepository {
  public async createSubscription({
    trainerId,
    durationInWeeks,
    price,
    sessionsPerWeek,
    stripePriceId,
    subPeriod,
    totalSessions,
  }: CreateSubscriptionDTO): Promise<Subscription> {
    const id = new mongoose.Types.ObjectId(trainerId);
    const createSubscriptionData = {
      durationInWeeks,
      price,
      sessionsPerWeek,
      stripePriceId,
      subPeriod,
      totalSessions,
    };
    const subscription = await SubscriptionModel.create({
      ...createSubscriptionData,
      trainerId: id,
    });

    return subscription.toObject();
  }
  public async findAllSubscription(trainerId: IdDTO): Promise<Subscription[]> {
    return await SubscriptionModel.find({ trainerId: trainerId })
      .sort({ createdAt: -1 })
      .lean();
  }
  public async findExistingSubscription({
    subPeriod,
    trainerId,
  }: FindExistingSubscriptionDTO): Promise<boolean> {
    const existingSubscription = await SubscriptionModel.findOne({
      trainerId: trainerId,
      subPeriod: subPeriod,
    });
    return existingSubscription ? true : false;
  }

  public async updateBlockStatus({
    subscriptionId,
    isBlocked,
  }: UpdateSubscriptionBlockStatusDTO): Promise<Subscription | null> {
    return await SubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      { isBlocked: isBlocked },
      { new: true }
    ).lean();
  }

  public async editSubscription({
    subscriptionId,
    price,
    subPeriod,
    durationInWeeks,
    sessionsPerWeek,
    totalSessions,
    stripePriceId
  }: UpdateSubscriptionDetailsDTO): Promise<Subscription | null> {
    return await SubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      {
        price,
        subPeriod,
        durationInWeeks,
        sessionsPerWeek,
        totalSessions,
        stripePriceId,
      },
      { new: true }
    ).lean();
  }
  public async deletedSubscription(
    subscriptionId: IdDTO
  ): Promise<Subscription | null> {
    return await SubscriptionModel.findByIdAndDelete(subscriptionId).lean();
  }
  public async findSubscriptionById(
    subscriptionId: IdDTO
  ): Promise<Subscription | null> {
    return await SubscriptionModel.findById(subscriptionId).lean();
  }

}
