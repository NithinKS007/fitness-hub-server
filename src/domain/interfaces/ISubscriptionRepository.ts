import {
  CreateSubscriptionDTO,
  FindExistingSubscriptionDTO,
  UpdateSubscriptionBlockStatusDTO,
  UpdateSubscriptionDetailsDTO,
} from "../../application/dtos/subscription-dtos";
import { Subscription } from "../entities/subscription.entities";

export interface ISubscriptionRepository {
  createSubscription(
    createSubscriptionData: CreateSubscriptionDTO
  ): Promise<Subscription>;
  findAllSubscription(trainerId: string): Promise<Subscription[]>;
  findExistingSubscription(
    findExistingSub: FindExistingSubscriptionDTO
  ): Promise<boolean>;
  updateBlockStatus(
    updateSubBlockStatus: UpdateSubscriptionBlockStatusDTO
  ): Promise<Subscription | null>;
  editSubscription(
    updateSubDetails: UpdateSubscriptionDetailsDTO
  ): Promise<Subscription | null>;
  findSubscriptionById(subscriptionId: string): Promise<Subscription | null>;
  deletedSubscription(subscriptionId: string): Promise<Subscription | null>;
}
