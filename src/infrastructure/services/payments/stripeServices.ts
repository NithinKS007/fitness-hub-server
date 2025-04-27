import Stripe from "stripe";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  SubscriptionStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import stripe from "../../config/stripeConfig";
import {
  CreatePrice,
  CreateProduct,
  CreateSubscriptionSession,
  DeactivatePrice,
  Session,
  SubscriptionMetadata,
} from "../../../application/dtos/serviceDTOs/paymentServiceDTOs";
import { IdDTO } from "../../../application/dtos/utilityDTOs";
import { IPaymentService } from "../../../application/interfaces/payments/IPaymentService";

export class StripePaymentService implements IPaymentService {
  public async createProduct({
    name,
    description,
  }: CreateProduct): Promise<string> {
    try {
      const product = await stripe.products.create({ name, description });
      return product.id;
    } catch (error) {
      console.log("Error creating product:", error);
      throw new validationError("Failed to create product in stripe service");
    }
  }
  public async createPrice({
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

  public async deactivatePrice({ priceId }: DeactivatePrice): Promise<void> {
    await stripe.prices.update(priceId, { active: false });
  }
  public async createSubscriptionSession({
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
        SubscriptionStatusMessage.FailedToCreateSubscriptionSession
      );
    }
  }

  public async getCheckoutSession(
    sessionId: IdDTO
  ): Promise<Stripe.Checkout.Session> {
    if (!sessionId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      throw new validationError(
        SubscriptionStatusMessage.InvalidSessionIdForStripe
      );
    }
    return session;
  }

  public async getSubscription(
    stripeSubscriptionId: IdDTO
  ): Promise<Stripe.Subscription> {
    if (!stripeSubscriptionId) {
      throw new validationError(AuthenticationStatusMessage.InvalidId);
    }
    const subscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );
    if (!subscription) {
      throw new validationError(AuthenticationStatusMessage.InvalidId);
    }
    return subscription;
  }
  public async cancelSubscription(
    stripeSubscriptionId: IdDTO
  ): Promise<Stripe.Subscription> {
    if (!stripeSubscriptionId) {
      throw new validationError(AuthenticationStatusMessage.InvalidId);
    }
    const canceledSub = await stripe.subscriptions.cancel(stripeSubscriptionId);
    return canceledSub;
  }

  public async getSubscriptionsData(
    stripeSubscriptionId: IdDTO
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
