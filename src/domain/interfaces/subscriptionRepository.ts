import { CreateSubscriptionDTO,FindExistingSubscriptionDTO,UpdateSubscriptionBlockStatusDTO,UpdateSubscriptionDetailsDTO } from "../../application/dtos/subscriptionDTOs";
import { IdDTO } from "../../application/dtos/utilityDTOs";
import { Subscription } from "../entities/subscriptionEntity";

export interface SubscriptionRepository {
  createSubscription(data: CreateSubscriptionDTO): Promise<Subscription>;
  findAllSubscription(data:IdDTO):Promise<Subscription[]>
  findExistingSubscription(data:FindExistingSubscriptionDTO):Promise<boolean>
  updateBlockStatus(data:UpdateSubscriptionBlockStatusDTO):Promise<Subscription | null>
  editSubscription(data:UpdateSubscriptionDetailsDTO):Promise<Subscription | null>
  findSubscriptionById(data:IdDTO):Promise<Subscription | null>
  deletedSubscription(data:IdDTO):Promise<Subscription | null>
  findSubscriptionByTrainerId(data:IdDTO):Promise<Subscription[]>
}
