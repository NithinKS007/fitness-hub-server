import mongoose from "mongoose";
import { CreateSubscriptionDTO,FindExistingSubscriptionDTO,UpdateSubscriptionBlockStatusDTO,UpdateSubscriptionDetailsDTO } from "../../../application/dtos/subscriptionDTOs";
import { IdDTO } from "../../../application/dtos/utilityDTOs";
import { Subscription } from "../../../domain/entities/subscriptionEntity";
import { SubscriptionRepository } from "../../../domain/interfaces/subscriptionRepository";
import SubscriptionModel from "../models/subscriptionModel";

export class MongoSubscriptionRepository implements SubscriptionRepository {
  public async createSubscription( data: CreateSubscriptionDTO ): Promise<Subscription> {
    const {trainerId} = data

    const id =   new mongoose.Types.ObjectId(trainerId);
    const subscription = await SubscriptionModel.create({...data,trainerId:id});
  
    return subscription.toObject();
  }
  public async findAllSubscription(data: IdDTO): Promise<Subscription[]> {
    return await SubscriptionModel.find({ trainerId: data }).sort({ createdAt: -1 }).lean()
  }
  public async findExistingSubscription(data: FindExistingSubscriptionDTO ): Promise<boolean> {
    const existingSubscription = await SubscriptionModel.findOne({
      trainerId: data.trainerId,
      subPeriod: data.subPeriod,
    });
    return existingSubscription ? true : false;
  }

  public async updateBlockStatus(data: UpdateSubscriptionBlockStatusDTO): Promise<Subscription | null> {
    const { _id, isBlocked } = data;
    return await SubscriptionModel.findByIdAndUpdate(
      _id,
      { isBlocked: isBlocked },
      { new: true }
    ).lean()
  }

  public async editSubscription(data: UpdateSubscriptionDetailsDTO ): Promise<Subscription | null> {
    const { _id, price,subPeriod, durationInWeeks, sessionsPerWeek, totalSessions,stripePriceId } =
      data;
    return await SubscriptionModel.findByIdAndUpdate(
      _id,
      { price,subPeriod, durationInWeeks, sessionsPerWeek, totalSessions,stripePriceId },
      { new: true }
    ).lean()
  }
  public async deletedSubscription(data: IdDTO): Promise<Subscription | null> {
    return await SubscriptionModel.findByIdAndDelete(data).lean()
  }
  public async findSubscriptionById(data: IdDTO): Promise<Subscription | null> {
    return await SubscriptionModel.findById(data).lean()
  }

  public async findSubscriptionByTrainerId(data: IdDTO):Promise<Subscription[] > {
    return await SubscriptionModel.find({trainerId:data,isBlocked:false}).lean()
  }
}
