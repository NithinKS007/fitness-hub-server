import { PlanType, SubPeriod } from "../../infrastructure/databases/models/subscriptionModel";

export interface Subscription {
  _id: string;
  trainerId: string;
  subPeriod: SubPeriod;
  planType: PlanType;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isActive: boolean;
}
