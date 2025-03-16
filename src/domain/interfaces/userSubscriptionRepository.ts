import { CheckSubscriptionStatus, createUserSubscriptionPlanDTO, IdDTO, UpdateSubscriptionStatus } from "../../application/dtos";
import { SubscriptionPlanEntity } from "../entities/userSubscriptionPlanEntity";

export interface UserSubscriptionPlanRepository {
    create(data:createUserSubscriptionPlanDTO):Promise<SubscriptionPlanEntity>
    findSubscriptionsOfUser(data:IdDTO):Promise<SubscriptionPlanEntity[] | null>
    findSubscriptionsOfTrainer(data:IdDTO):Promise<SubscriptionPlanEntity[] | null>
    findSubscriptionByStripeSubscriptionId(data:IdDTO):Promise<SubscriptionPlanEntity>
    findSubscriptionsOfUserwithUserIdAndTrainerId(data:CheckSubscriptionStatus):Promise<SubscriptionPlanEntity[] | null>
    findSubscriptionByStripeSubscriptionIdAndUpdateStatus(data:UpdateSubscriptionStatus):Promise<SubscriptionPlanEntity | null>
}