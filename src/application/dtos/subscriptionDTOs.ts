type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";

export interface CreateSubscriptionDTO {
  trainerId: string;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
}

export interface FindExistingSubscriptionDTO {
  trainerId: string;
  subPeriod: SubPeriod;
}

export interface UpdateSubscriptionBlockStatusDTO {
  _id: string;
  isBlocked: string;
}

export interface UpdateSubscriptionDetailsDTO {
  _id: string;
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

export interface CreateUserSubscriptionPlanDTO {
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

export interface CancelSubscriptionDTO {
  stripeSubscriptionId: string;
  action: string;
}

export interface CheckSubscriptionStatusDTO {
  _id: string;
  trainerId: string;
}

export interface UpdateSubscriptionStatusDTO {
  stripeSubscriptionId: string;
  status: string;
}
