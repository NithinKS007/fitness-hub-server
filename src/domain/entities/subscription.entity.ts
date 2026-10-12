export interface Subscription {
  id: string;
  trainerId: string;
  subPeriod: string;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
  providerPriceId: string;
  createdAt: Date;
  updatedAt: Date;
}
