import mongoose, { Document } from "mongoose";

export interface IRevenue extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  subscriptionId: string | mongoose.Schema.Types.ObjectId;
  userSubscriptionPlanId: string | mongoose.Schema.Types.ObjectId;
  trainerId: string | mongoose.Schema.Types.ObjectId;
  userId: string | mongoose.Schema.Types.ObjectId;
  amountPaid: number;
  platformRevenue: number;
  trainerRevenue: number;
  commission: number;
}
