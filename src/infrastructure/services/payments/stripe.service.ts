import Stripe from "stripe";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import stripe from "@infrastructure/config/stripe.config";
import {
  CreatePrice,
  CreateProduct,
  CreateSubscriptionSession,
  DeactivatePrice,
  Session,
} from "@application/dtos/service/payment.service";
import { IPaymentService } from "@application/interfaces/services/payments/IPayment.service";
import { injectable } from "inversify";

@injectable()
export class StripePaymentService implements IPaymentService {
  async addProduct({ name, description }: CreateProduct): Promise<string> {
    try {
      const product = await stripe.products.create({ name, description });
      return product.id;
    } catch (error) {
      console.log("Error creating product:", error);
      throw new validationError("Failed to create product in stripe service");
    }
  }
  async addPrice({
    productId,
    amount,
    currency,
    interval,
    intervalCount,
  }: CreatePrice): Promise<string> {
    try {
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: amount,
        currency,
        recurring: { interval, interval_count: intervalCount },
      });
      return price.id;
    } catch (error) {
      console.log("Error creating price:", error);
      throw new validationError("Failed to create stripe service");
    }
  }

  async deactivatePrice({ priceId }: DeactivatePrice): Promise<void> {
    await stripe.prices.update(priceId, { active: false });
  }

  async createSession({
    providerPriceId,
    userId,
    trainerId,
    subscriptionId,
  }: CreateSubscriptionSession): Promise<Session> {
    try {
      const productionUrl = process.env.CLIENT_ORIGINS;
      const successUrl = `/${process.env.STRIPE_SUCCESS_URL}`;
      const failureUrl = `/${process.env.STRIPE_FAILURE_URL}`;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: providerPriceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${productionUrl}${successUrl}`,
        cancel_url: `${productionUrl}${failureUrl}`,
        client_reference_id: userId,
        metadata: {
          subscriptionId: subscriptionId,
          trainerId: trainerId,
        },
      });
      return { sessionId: session.id };
    } catch (error) {
      console.log("error occured in stripe service layer", error);
      throw new validationError(SubscriptionStatus.SessionCreateFailed);
    }
  }

  async getSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    if (!sessionId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      throw new validationError(SubscriptionStatus.InvalidSessionId);
    }
    return session;
  }

  async getSubscriptionById({
    providerSubId,
  }: {
    providerSubId: string;
  }): Promise<Stripe.Subscription> {
    if (!providerSubId) {
      throw new validationError(AuthStatus.InvalidId);
    }
    const subscription = await stripe.subscriptions.retrieve(providerSubId);
    if (!subscription) {
      throw new validationError(AuthStatus.InvalidId);
    }
    return subscription;
  }

  async cancelSubscription({
    providerSubId,
  }: {
    providerSubId: string;
  }): Promise<Stripe.Subscription> {
    if (!providerSubId) {
      throw new validationError(AuthStatus.InvalidId);
    }
    const canceledSub = await stripe.subscriptions.cancel(providerSubId);
    return canceledSub;
  }

  async constructWebHookEvent(
    body: string | Buffer,
    sig: string,
    webhookSecret: string
  ): Promise<Stripe.Event> {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    if (!event) {
      throw new validationError(SubscriptionStatus.WebHookVerificationFailed);
    }
    return event;
  }
}
