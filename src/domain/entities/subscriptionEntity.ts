import { ObjectId } from "mongoose";
import {  SubPeriod } from "../../infrastructure/databases/models/subscriptionModel";

export interface Subscription {
  _id : string | ObjectId
  trainerId: string | ObjectId
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
  stripePriceId:string
}
