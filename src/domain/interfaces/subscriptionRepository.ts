import { CreateSubscriptionDTO, findExistingSubscriptionDTO, IdDTO, updateSubscriptionBlockStatus, updateSubscriptionDetails } from "../../application/dtos";
import { Subscription } from "../entities/subscriptionEntity";

export interface SubscriptionRepository {
  createSubscription(data: CreateSubscriptionDTO): Promise<Subscription>;
  findAllSubscription(data:IdDTO):Promise<Subscription[]>
  findExistingSubscription(data:findExistingSubscriptionDTO):Promise<boolean>
  updateBlockStatus(data:updateSubscriptionBlockStatus):Promise<Subscription | null>
  editSubscription(data:updateSubscriptionDetails):Promise<Subscription | null>
  findSubscriptionById(data:IdDTO):Promise<Subscription | null>
  deletedSubscription(data:IdDTO):Promise<Subscription | null>
  findSubscriptionByTrainerId(data:IdDTO):Promise<Subscription[]>
}
