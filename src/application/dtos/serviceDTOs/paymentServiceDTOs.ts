export interface SubscriptionMetadata {
  startDate: string;
  endDate: string;
  isActive: string;
  stripeSubscriptionStatus: string;
}

export interface CreateProduct {
  name: string;
  description: string;
}

export interface CreatePrice {
  productId: string;
  amount: number;
  currency: string;
  interval: "year" | "month";
  intervalCount: number;
}

export interface DeactivatePrice {
  priceId: string;
}

export interface CreateSubscriptionSession {
  stripePriceId: string;
  userId: string;
  trainerId: string;
  subscriptionId: string;
}

export interface Session {
    sessionId:string
}
