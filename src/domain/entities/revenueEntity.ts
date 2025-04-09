import { ObjectId } from "mongoose";

export interface Revenue {
  subscriptionId: ObjectId;
  userSubscriptionPlanId: ObjectId;
  trainerId: ObjectId;
  amountPaid: number;
  platformRevenue: number;
  trainerRevenue: number;
}
