import mongoose, { Document } from "mongoose";
export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";
export interface ISubscription extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  trainerId: string | mongoose.Schema.Types.ObjectId;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
  stripePriceId: string;
}
