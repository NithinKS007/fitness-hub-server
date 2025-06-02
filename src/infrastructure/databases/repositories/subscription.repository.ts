import mongoose from "mongoose";
import {
  CreateSubscriptionDTO,
  FindExistingSubscriptionDTO,
  UpdateSubscriptionBlockStatusDTO,
  UpdateSubscriptionDetailsDTO,
} from "../../../application/dtos/subscription-dtos";
import { Subscription } from "../../../domain/entities/subscription.entities";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import SubscriptionModel from "../models/subscription.model";

export class SubscriptionRepository implements ISubscriptionRepository {
  async createSubscription({
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
  async findAllSubscription(trainerId: string): Promise<Subscription[]> {
    return await SubscriptionModel.find({ trainerId: trainerId })
      .sort({ createdAt: -1 })
      .lean();
  }
  async findExistingSubscription({
    subPeriod,
    trainerId,
  }: FindExistingSubscriptionDTO): Promise<boolean> {
    const existingSubscription = await SubscriptionModel.findOne({
      trainerId: trainerId,
      subPeriod: subPeriod,
    });
    return existingSubscription ? true : false;
  }

  async updateBlockStatus({
    subscriptionId,
    isBlocked,
  }: UpdateSubscriptionBlockStatusDTO): Promise<Subscription | null> {
    return await SubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      { isBlocked: isBlocked },
      { new: true }
    ).lean();
  }

  async editSubscription({
    subscriptionId,
    price,
    subPeriod,
    durationInWeeks,
    sessionsPerWeek,
    totalSessions,
    stripePriceId,
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
  async deletedSubscription(
    subscriptionId: string
  ): Promise<Subscription | null> {
    return await SubscriptionModel.findByIdAndDelete(subscriptionId).lean();
  }
  async findSubscriptionById(
    subscriptionId: string
  ): Promise<Subscription | null> {
    return await SubscriptionModel.findById(subscriptionId).lean();
  }
}
