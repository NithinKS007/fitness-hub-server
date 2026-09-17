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
  providerPriceId: string;
  userId: string;
  trainerId: string;
  subscriptionId: string;
}

export interface Session {
  sessionId: string;
}
