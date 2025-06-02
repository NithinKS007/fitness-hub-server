import Stripe from "stripe";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AuthStatus,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import stripe from "../../config/stripe.config";
import {
  CreatePrice,
  CreateProduct,
  CreateSubscriptionSession,
  DeactivatePrice,
  Session,
  SubscriptionMetadata,
} from "../../../application/dtos/service/payment.service";
import { IPaymentService } from "../../../application/interfaces/payments/IPayment.service";

export class StripePaymentService implements IPaymentService {
  async createProduct({ name, description }: CreateProduct): Promise<string> {
    try {
      const product = await stripe.products.create({ name, description });
      return product.id;
    } catch (error) {
      console.log("Error creating product:", error);
      throw new validationError("Failed to create product in stripe service");
    }
  }
  async createPrice({
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
  async createSubscriptionSession({
    stripePriceId,
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
            price: stripePriceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${productionUrl}${successUrl}`,
        cancel_url: `${productionUrl}${failureUrl}`,
        client_reference_id: userId.toString(),
        metadata: {
          subscriptionId: subscriptionId.toString(),
          trainerId: trainerId.toString(),
        },
      });
      return { sessionId: session.id };
    } catch (error) {
      console.log("error occured in stripe service layer", error);
      throw new validationError(
        SubscriptionStatus.FailedToCreateSubscriptionSession
      );
    }
  }

  async getCheckoutSession(
    sessionId: string
  ): Promise<Stripe.Checkout.Session> {
    if (!sessionId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      throw new validationError(SubscriptionStatus.InvalidSessionIdForStripe);
    }
    return session;
  }

  async getSubscription(
    stripeSubscriptionId: string
  ): Promise<Stripe.Subscription> {
    if (!stripeSubscriptionId) {
      throw new validationError(AuthStatus.InvalidId);
    }
    const subscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );
    if (!subscription) {
      throw new validationError(AuthStatus.InvalidId);
    }
    return subscription;
  }
  async cancelSubscription(
    stripeSubscriptionId: string
  ): Promise<Stripe.Subscription> {
    if (!stripeSubscriptionId) {
      throw new validationError(AuthStatus.InvalidId);
    }
    const canceledSub = await stripe.subscriptions.cancel(stripeSubscriptionId);
    return canceledSub;
  }

  async getSubscriptionsData(
    stripeSubscriptionId: string
  ): Promise<SubscriptionMetadata> {
    const stripeSub = await this.getSubscription(stripeSubscriptionId);
    return {
      startDate: new Date(stripeSub.current_period_start * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date(stripeSub.current_period_end * 1000)
        .toISOString()
        .split("T")[0],
      isActive: stripeSub.status,
      stripeSubscriptionStatus: stripeSub.status,
    };
  }
}
