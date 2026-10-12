import {
  CreatePrice,
  CreateProduct,
  CreateSubscriptionSession,
  DeactivatePrice,
  Session,
  PaymentSession,
  PaymentSubscription,
  PaymentWebhookEvent,
} from "@application/dtos/service/payment.service";

export interface IPaymentService {
  addProduct(createProduct: CreateProduct): Promise<string>;
  addPrice(createPrice: CreatePrice): Promise<string>;
  deactivatePrice(deactivatePrice: DeactivatePrice): Promise<void>;
  createSession(
    createSubscriptionSession: CreateSubscriptionSession
  ): Promise<Session>;
  getSession(sessionId: string): Promise<PaymentSession>;
  getSubscriptionById({
    providerSubId,
  }: {
    providerSubId: string;
  }): Promise<PaymentSubscription>;
  cancelSubscription({
    providerSubId,
  }: {
    providerSubId: string;
  }): Promise<PaymentSubscription>;
  constructWebHookEvent(
    body: string | Buffer,
    sig: string,
    webhookSecret: string
  ): Promise<PaymentWebhookEvent>;
}
