import Stripe from "stripe";
import {
  CreatePrice,
  CreateProduct,
  CreateSubscriptionSession,
  DeactivatePrice,
  Session,
  SubscriptionMetadata,
} from "../../dtos/service/payment.service";

export interface IPaymentService {
  createProduct(createProduct: CreateProduct): Promise<string>;
  createPrice(createPrice: CreatePrice): Promise<string>;
  deactivatePrice(deactivatePrice: DeactivatePrice): Promise<void>;
  createSubscriptionSession(
    createSubscriptionSession: CreateSubscriptionSession
  ): Promise<Session>;
  getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>;
  getSubscription(stripeSubscriptionId: string): Promise<Stripe.Subscription>;
  cancelSubscription(stripeSubscriptionId: string): Promise<Stripe.Subscription>;
  getSubscriptionsData(
    stripeSubscriptionId: string
  ): Promise<SubscriptionMetadata>;
}
