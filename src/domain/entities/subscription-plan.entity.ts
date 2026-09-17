export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";

export interface UserSubscriptionPlan {
  id: string;
  userId: string;
  trainerId: string;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  providerPriceId: string;
  providerSubId: string;
  providerSubStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
