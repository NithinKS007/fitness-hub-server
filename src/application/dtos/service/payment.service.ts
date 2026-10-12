export interface CreateProduct {
  name: string;
  description: string;
}

export interface CreatePrice {
  productId: string;
  amount: number;
  currency: string;
  interval: string;
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

export enum PaymentWebhookEventType {
  CheckoutSessionCompleted = "checkout.session.completed",
  InvoicePaymentFailed = "invoice.payment_failed",
  CustomerSubscriptionDeleted = "customer.subscription.deleted",
  Unhandled = "unhandled",
}

export interface PaymentWebhookMetadata {
  subscriptionId?: string;
  trainerId?: string;
}

export interface PaymentWebhookData {
  clientReferenceId?: string;
  subscriptionId?: string;
  metadata?: PaymentWebhookMetadata;
}

/** Provider-neutral webhook event passed from an adapter to the application. */
export interface PaymentWebhookEvent {
  type: PaymentWebhookEventType;
  data: PaymentWebhookData;
}
