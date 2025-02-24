import { CreateSubscriptionDTO, findExistingSubscriptionDTO, IdDTO } from "../../../application/dtos";
import { Subscription } from "../../../domain/entities/subscriptionEntity";
import { subscriptionRepository } from "../../../domain/interfaces/subscriptionRepository";
import SubscriptionModel from "../models/subscriptionModel";

export class MongoSubscriptionRepository implements subscriptionRepository {
    public async createSubscription(data:CreateSubscriptionDTO):Promise<Subscription>{
        return await SubscriptionModel.create(data)
    }
    public async findAllSubscription(data:IdDTO):Promise<Subscription[]>{
        return await SubscriptionModel.find({trainerId:data})
    }
    public async findExistingSubscription(data:findExistingSubscriptionDTO):Promise<boolean>{
       const  existingSubscription = await SubscriptionModel.findOne({trainerId:data.trainerId,$and:[{subPeriod:data.subPeriod},{planType:data.planType}]})
        return existingSubscription ? true : false;
    }
}