import {  SubPeriod } from "../../infrastructure/databases/models/subscriptionModel";

export interface Subscription {
  _id: string;
  trainerId: string;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
}
