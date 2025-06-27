import { Document, ObjectId } from "mongoose";

export interface IRevenue extends Document {
  _id: ObjectId;
  subscriptionId: string | ObjectId;
  userSubscriptionPlanId: string | ObjectId;
  trainerId: string | ObjectId;
  userId: string | ObjectId;
  amountPaid: number;
  platformRevenue: number;
  trainerRevenue: number;
  commission: number;
}
