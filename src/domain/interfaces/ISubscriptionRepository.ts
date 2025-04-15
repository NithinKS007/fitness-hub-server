import { CreateSubscriptionDTO,FindExistingSubscriptionDTO,UpdateSubscriptionBlockStatusDTO,UpdateSubscriptionDetailsDTO } from "../../application/dtos/subscriptionDTOs";
import { IdDTO } from "../../application/dtos/utilityDTOs";
import { Subscription } from "../entities/subscriptionEntity";

export interface ISubscriptionRepository {
  createSubscription(createSubscriptionData: CreateSubscriptionDTO): Promise<Subscription>;
  findAllSubscription(trainerId:IdDTO):Promise<Subscription[]>
  findExistingSubscription(findExistingSub:FindExistingSubscriptionDTO):Promise<boolean>
  updateBlockStatus(updateSubBlockStatus:UpdateSubscriptionBlockStatusDTO):Promise<Subscription | null>
  editSubscription(updateSubDetails:UpdateSubscriptionDetailsDTO):Promise<Subscription | null>
  findSubscriptionById(subscriptionId:IdDTO):Promise<Subscription | null>
  deletedSubscription(subscriptionId:IdDTO):Promise<Subscription | null>
}
