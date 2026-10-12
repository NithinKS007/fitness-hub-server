export interface UserSubscriptionPlan {
  id: string;
  userId: string;
  trainerId: string;
  subPeriod: string;
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
