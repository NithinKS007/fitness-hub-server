import Stripe from "stripe";
import {
  CreatePrice,
  CreateProduct,
  CreateSubscriptionSession,
  DeactivatePrice,
  Session,
  SubscriptionMetadata,
} from "@application/dtos/service/payment.service";

export interface IPaymentService {
  addProduct(createProduct: CreateProduct): Promise<string>;
  addPrice(createPrice: CreatePrice): Promise<string>;
  deactivatePrice(deactivatePrice: DeactivatePrice): Promise<void>;
  createSubscriptionSession(
    createSubscriptionSession: CreateSubscriptionSession
  ): Promise<Session>;
  getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>;
  getSubscription(stripeSubscriptionId: string): Promise<Stripe.Subscription>;
  cancelSubscription(
    stripeSubscriptionId: string
  ): Promise<Stripe.Subscription>;
  getSubscriptionsData(
    stripeSubscriptionId: string
  ): Promise<SubscriptionMetadata>;
  constructStripeEvent(
    body: string | Buffer,
    sig: string,
    webhookSecret: string
  ): Promise<Stripe.Event>;
}
