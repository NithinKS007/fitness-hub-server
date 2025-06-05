export enum CancelSubAction {
  immediately = "cancelImmediately",
  atEndOfCycle = "cancelAtEndOfCycle",
}

export enum PeriodType {
  Quarterly = "quarterly",
  HalfYearly = "halfYearly",
  Yearly = "yearly",
  Monthly = "monthly",
}

export type SubPeriod = PeriodType;

export enum SubscriptionInterval {
  Month = "month",
  Year = "year",
}

export interface FindExistingSubscriptionDTO {
  trainerId: string;
  subPeriod: SubPeriod;
}

export interface UpdateSubscriptionBlockStatusDTO {
  subscriptionId: string;
  isBlocked: string;
}

export interface UpdateSubscriptionDetailsDTO {
  subscriptionId: string;
  trainerId: string;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
}

export interface PurchaseSubscriptionDTO {
  subscriptionId: string;
  userId: string;
}

export interface CancelSubscriptionDTO {
  stripeSubscriptionId: string;
  action: string;
}

export interface CheckSubscriptionStatusDTO {
  userId: string;
  trainerId: string;
}

export interface UpdateSubscriptionStatusDTO {
  stripeSubscriptionId: string;
  status: string;
}
