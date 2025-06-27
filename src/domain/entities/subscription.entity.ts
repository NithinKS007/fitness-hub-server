import { Document, ObjectId } from "mongoose";
export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";
export interface ISubscription extends Document {
  _id: ObjectId;
  trainerId: string | ObjectId;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
  stripePriceId: string;
}
