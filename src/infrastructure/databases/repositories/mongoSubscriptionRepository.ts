import {
  CreateSubscriptionDTO,
  findExistingSubscriptionDTO,
  IdDTO,
  updateSubscriptionBlockStatus,
  updateSubscriptionDetails,
} from "../../../application/dtos";
import { Subscription } from "../../../domain/entities/subscriptionEntity";
import { TrainerWithSubscription } from "../../../domain/entities/trainerWithSubscription";
import { SubscriptionRepository } from "../../../domain/interfaces/subscriptionRepository";
import SubscriptionModel from "../models/subscriptionModel";

export class MongoSubscriptionRepository implements SubscriptionRepository {
  public async createSubscription(
    data: CreateSubscriptionDTO
  ): Promise<Subscription> {
    return  (await SubscriptionModel.create(data)).toObject()
  }
  public async findAllSubscription(data: IdDTO): Promise<Subscription[]> {
    return await SubscriptionModel.find({ trainerId: data })
  }
  public async findExistingSubscription(
    data: findExistingSubscriptionDTO
  ): Promise<boolean> {
    const existingSubscription = await SubscriptionModel.findOne({
      trainerId: data.trainerId,
      subPeriod: data.subPeriod,
    });
    return existingSubscription ? true : false;
  }

  public async updateBlockStatus(
    data: updateSubscriptionBlockStatus
  ): Promise<Subscription | null> {
    const { _id, isBlocked } = data;
    return await SubscriptionModel.findByIdAndUpdate(
      _id,
      { isBlocked: isBlocked },
      { new: true }
    )
  }

  public async editSubscription(
    data: updateSubscriptionDetails
  ): Promise<Subscription | null> {
    const { _id, price, durationInWeeks, sessionsPerWeek, totalSessions } =
      data;
    return await SubscriptionModel.findByIdAndUpdate(
      _id,
      { price, durationInWeeks, sessionsPerWeek, totalSessions },
      { new: true }
    )
  }
  public async deletedSubscription(data: IdDTO): Promise<Subscription | null> {
    return await SubscriptionModel.findByIdAndDelete(data)
  }
  public async findSubscriptionById(data: IdDTO): Promise<Subscription | null> {
    return await SubscriptionModel.findById(data)
  }

  public async findSubscriptionByTrainerId(data: IdDTO):Promise<Subscription[] > {
    return await SubscriptionModel.find({trainerId:data,isBlocked:false})
  }
}
