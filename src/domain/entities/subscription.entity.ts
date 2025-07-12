export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";
export interface Subscription {
  _id: string;
  trainerId: string;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
  stripePriceId: string;
}
