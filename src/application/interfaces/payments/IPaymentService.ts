import Stripe from "stripe";
import {
  CreatePrice,
  CreateProduct,
  CreateSubscriptionSession,
  DeactivatePrice,
  Session,
  SubscriptionMetadata,
} from "../../dtos/service/payment-service";
import { IdDTO } from "../../dtos/utility-dtos";

export interface IPaymentService {
  createProduct(createProduct: CreateProduct): Promise<string>;
  createPrice(createPrice: CreatePrice): Promise<string>;
  deactivatePrice(deactivatePrice: DeactivatePrice): Promise<void>;
  createSubscriptionSession(
    createSubscriptionSession: CreateSubscriptionSession
  ): Promise<Session>;
  getCheckoutSession(sessionId: IdDTO): Promise<Stripe.Checkout.Session>;
  getSubscription(stripeSubscriptionId: IdDTO): Promise<Stripe.Subscription>;
  cancelSubscription(stripeSubscriptionId: IdDTO): Promise<Stripe.Subscription>;
  getSubscriptionsData(
    stripeSubscriptionId: IdDTO
  ): Promise<SubscriptionMetadata>;
}
