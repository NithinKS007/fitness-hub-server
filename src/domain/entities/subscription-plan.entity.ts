export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";

export interface UserSubscriptionPlan {
  _id: string;
  userId: string;
  trainerId: string;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
  stripeSubscriptionId: string;
  stripeSubscriptionStatus: string;
}
