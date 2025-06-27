import { Document, ObjectId } from "mongoose";
export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";

export interface IUserSubscriptionPlan extends Document {
  _id: ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
  stripeSubscriptionId: string;
  stripeSubscriptionStatus: string;
}
