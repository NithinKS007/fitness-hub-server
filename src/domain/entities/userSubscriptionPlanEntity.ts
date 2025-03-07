import { ObjectId } from "mongoose";
import { SubPeriod } from "../../infrastructure/databases/models/subscriptionModel";

export interface SubscriptionPlanEntity {
  _id:ObjectId
  userId: string | ObjectId
  trainerId: string | ObjectId
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
  stripeSubscriptionId: any
}

