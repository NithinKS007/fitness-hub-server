import Stripe from "stripe";
import {
  CreatePrice,
  CreateProduct,
  CreateSubscriptionSession,
  DeactivatePrice,
  Session,
} from "@application/dtos/service/payment.service";

export interface IPaymentService {
  addProduct(createProduct: CreateProduct): Promise<string>;
  addPrice(createPrice: CreatePrice): Promise<string>;
  deactivatePrice(deactivatePrice: DeactivatePrice): Promise<void>;
  createSession(
    createSubscriptionSession: CreateSubscriptionSession
  ): Promise<Session>;
  getSession(sessionId: string): Promise<Stripe.Checkout.Session>;
  getSubscriptionById({
    providerSubId,
  }: {
    providerSubId: string;
  }): Promise<Stripe.Subscription>;
  cancelSubscription({
    providerSubId,
  }: {
    providerSubId: string;
  }): Promise<Stripe.Subscription>;
  constructWebHookEvent(
    body: string | Buffer,
    sig: string,
    webhookSecret: string
  ): Promise<Stripe.Event>;
}
