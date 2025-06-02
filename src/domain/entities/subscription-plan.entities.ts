import { ObjectId } from "mongoose";
import { SubPeriod } from "../../infrastructure/databases/models/subscription.model";

export interface SubscriptionPlanEntity {
  _id: ObjectId | string;
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

export interface Top10Trainers {
  fname: string;
  lname: string;
  email: string;
}
