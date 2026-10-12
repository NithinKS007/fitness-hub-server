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

/** Provider-neutral payment values used by application use cases. */
export interface PaymentSession {
  id: string;
  subscriptionId?: string;
}

export interface PaymentSubscription {
  id: string;
  status: string;
  currentPeriodStart?: number;
  currentPeriodEnd?: number;
}

export type PaymentWebhookEvent =
  | {
      type: "checkout.session.completed";
      data: {
        clientReferenceId?: string;
        subscriptionId?: string;
        metadata?: { subscriptionId?: string; trainerId?: string };
      };
    }
  | {
      type: "invoice.payment_failed";
      data: { subscriptionId?: string };
    }
  | {
      type: "customer.subscription.deleted";
      data: { subscriptionId: string };
    }
  | { type: "unhandled"; data: unknown };
