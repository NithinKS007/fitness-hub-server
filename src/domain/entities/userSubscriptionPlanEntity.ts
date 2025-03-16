import { ObjectId } from "mongoose";
import { SubPeriod } from "../../infrastructure/databases/models/subscriptionModel";

export interface SubscriptionPlanEntity {
  _id:ObjectId | string
  userId: string | ObjectId
  trainerId: string | ObjectId
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
  stripeSubscriptionId: string,
  stripeSubscriptionStatus:string
}

