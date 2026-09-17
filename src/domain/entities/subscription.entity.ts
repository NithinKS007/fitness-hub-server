export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";
export interface Subscription {
  id: string;
  trainerId: string;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
  providerPriceId: string;
  createdAt: Date;
  updatedAt: Date;
}
