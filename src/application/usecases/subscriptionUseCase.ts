import {
  CancelSubscriptionDTO,
  CheckSubscriptionStatusDTO,
  PurchaseSubscriptionDTO,
  UpdateSubscriptionBlockStatusDTO,
  UpdateSubscriptionDetailsDTO,
} from "../dtos/subscriptionDTOs";
import { IdDTO, PaginationDTO } from "../dtos/utilityDTOs";
import stripe from "../../infrastructure/config/stripeConfig";
import { SubPeriod } from "../../infrastructure/databases/models/subscriptionModel";
import {
  cancelSubscription,
  createPrice,
  createProduct,
  createSubscriptionSession,
  deactivatePrice,
  getCheckoutSession,
  getSubscription,
  getSubscriptionsData,
} from "../../infrastructure/services/stripeServices";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  BlockStatusMessage,
  SubscriptionStatusMessage,
} from "../../shared/constants/httpResponseStructure";
import {
  Subscription,
  TrainerSubscribersList,
  UserMyTrainersList,
  UserSubscriptionRecord,
  UserSubscriptionsList,
} from "../../domain/entities/subscriptionEntity";
import { ISubscriptionRepository } from "../../domain/interfaces/ISubscriptionRepository";
import { ITrainerRepository } from "../../domain/interfaces/ITrainerRepository";
import { IUserSubscriptionPlanRepository } from "../../domain/interfaces/IUserSubscriptionRepository";
import { SubscriptionPlanEntity } from "../../domain/entities/userSubscriptionPlanEntity";
import {
  GetTrainerSubscribersQueryDTO,
  GetUserSubscriptionsQueryDTO,
  GetUserTrainersListQueryDTO,
} from "../dtos/queryDTOs";
import { IRevenueRepository } from "../../domain/interfaces/IRevenueRepository";
import { IConversationRepository } from "../../domain/interfaces/IConversationRepository";
import { handleLogInfo } from "../../shared/utils/handleLog";

export class SubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private trainerRepository: ITrainerRepository,
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private revenueRepository: IRevenueRepository,
    private conversationRepository: IConversationRepository
  ) {}

  private getInterval(subPeriod: SubPeriod): "month" | "year" {
    return subPeriod === "yearly" ? "year" : "month";
  }
  private getIntervalCount = (subPeriod: SubPeriod): number => {
    if (subPeriod === "quarterly") {
      return 3;
    } else if (subPeriod === "halfYearly") {
      return 6;
    } else if (subPeriod === "yearly") {
      return 1;
    } else {
      return 1;
    }
  };

  public async createSubscription(createSubscriptionData: {
    trainerId: string;
    subPeriod: SubPeriod;
    price: number;
    durationInWeeks: number;
    sessionsPerWeek: number;
    totalSessions: number;
  }): Promise<Subscription> {
    const { trainerId, subPeriod, totalSessions, price } =
      createSubscriptionData;
    const existing = await this.subscriptionRepository.findExistingSubscription(
      { trainerId, subPeriod }
    );

    const trainerData = await this.trainerRepository.getTrainerDetailsById(
      trainerId
    );

    if (existing) {
      throw new validationError(
        SubscriptionStatusMessage.SubscriptionAlreadyExists
      );
    }

    const interval = this.getInterval(subPeriod);
    const intervalCount = this.getIntervalCount(subPeriod);
    const productId = await createProduct(
      `${subPeriod.toUpperCase()} FITNESS PLAN`,
      `TRAINER: ${trainerData.fname} ${trainerData.lname}, ${totalSessions} SESSIONS, EMAIL: ${trainerData.email}`
    );
    const stripePriceId = await createPrice(
      productId,
      price * 100,
      "usd",
      interval,
      intervalCount
    );
    return await this.subscriptionRepository.createSubscription({
      ...createSubscriptionData,
      stripePriceId: stripePriceId,
    });
  }

  public async getTrainerSubscriptions(
    trainerId: IdDTO
  ): Promise<Subscription[]> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.IdRequired);
    }
    return await this.subscriptionRepository.findAllSubscription(trainerId);
  }

  public async updateSubscriptionBlockStatus({
    subscriptionId,
    isBlocked,
  }: UpdateSubscriptionBlockStatusDTO): Promise<Subscription> {
    if (!subscriptionId || typeof isBlocked !== "boolean") {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }

    const subscriptionData =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);

    if (!subscriptionData) {
      throw new validationError(AuthenticationStatusMessage.InvalidId);
    }

    const updatedSubscriptionData =
      await this.subscriptionRepository.updateBlockStatus({
        subscriptionId,
        isBlocked,
      });

    if (!updatedSubscriptionData) {
      throw new validationError(BlockStatusMessage.FailedToUpdateBlockStatus);
    }

    return updatedSubscriptionData;
  }

  public async editSubscription({
    subscriptionId,
    durationInWeeks,
    price,
    sessionsPerWeek,
    subPeriod,
    totalSessions,
    trainerId,
  }: UpdateSubscriptionDetailsDTO): Promise<Subscription> {
    if (
      !subscriptionId ||
      !durationInWeeks ||
      !price ||
      !sessionsPerWeek ||
      !subPeriod ||
      !totalSessions ||
      !trainerId
    ) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }

    const existingSubData =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);

    if (!existingSubData) {
      throw new validationError(AuthenticationStatusMessage.InvalidId);
    }

    const trainerData = await this.trainerRepository.getTrainerDetailsById(
      trainerId
    );

    let updatedSubscriptionData;
    if (
      subPeriod !== existingSubData?.subPeriod ||
      price !== existingSubData?.price ||
      totalSessions !== existingSubData?.totalSessions
    ) {
      const productId = await createProduct(
        `${subPeriod.toUpperCase()} FITNESS PLAN`,
        `TRAINER: ${trainerData?.fname} ${trainerData?.lname}, ${totalSessions} SESSIONS, EMAIL: ${trainerData?.email}`
      );

      const interval = this.getInterval(subPeriod);
      const intervalCount = this.getIntervalCount(subPeriod);
      const stripePriceId = await createPrice(
        productId,
        price * 100,
        "usd",
        interval,
        intervalCount
      );
      updatedSubscriptionData =
        await this.subscriptionRepository.editSubscription({
          ...{
            subscriptionId,
            durationInWeeks,
            price,
            sessionsPerWeek,
            stripePriceId,
            subPeriod,
            totalSessions,
            trainerId,
          },
          stripePriceId: stripePriceId,
        });
    }

    updatedSubscriptionData =
      await this.subscriptionRepository.editSubscription({
        ...{
          subscriptionId,
          durationInWeeks,
          price,
          sessionsPerWeek,
          stripePriceId: existingSubData?.stripePriceId,
          subPeriod,
          totalSessions,
          trainerId,
        },
      });
    if (!updatedSubscriptionData) {
      throw new validationError(BlockStatusMessage.FailedToUpdateBlockStatus);
    }
    return updatedSubscriptionData;
  }

  public async deleteSubscription(
    subscriptionId: IdDTO
  ): Promise<Subscription> {
    if (!subscriptionId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const subscriptionData =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);

    if (!subscriptionData) {
      throw new validationError(AuthenticationStatusMessage.InvalidId);
    }
    const stripePriceId = subscriptionData.stripePriceId;
    if (stripePriceId) {
      await deactivatePrice(stripePriceId);
    }
    const deletedSubscription =
      await this.subscriptionRepository.deletedSubscription(subscriptionId);

    if (!deletedSubscription) {
      throw new validationError(
        SubscriptionStatusMessage.FailedToDeleteSubscription
      );
    }
    return deletedSubscription;
  }

  public async createStripeSession({
    subscriptionId,
    userId,
  }: PurchaseSubscriptionDTO): Promise<string> {
    const subscriptionData =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);
    if (!subscriptionData) {
      throw new validationError(
        SubscriptionStatusMessage.FailedToRetrieveSubscriptionDetails
      );
    }

    if (subscriptionData.isBlocked) {
      throw new validationError(
        SubscriptionStatusMessage.SubscriptionBlockedUnavailabe
      );
    }
    const sessionId = await createSubscriptionSession({
      stripePriceId: subscriptionData.stripePriceId,
      userId: userId,
      trainerId: subscriptionData.trainerId.toString(),
      subscriptionId: subscriptionData._id.toString(),
    });
    if (!sessionId) {
      throw new validationError(
        SubscriptionStatusMessage.FailedToCreateSubscriptionSession
      );
    }
    return sessionId.sessionId;
  }

  private validateWebhookInput(sig: any, webhookSecret: any, body: any): void {
    if (!sig || !webhookSecret || !body) {
      throw new validationError(
        SubscriptionStatusMessage.WebHookCredentialsMissing
      );
    }
  }

  private constructStripeEvent(body: any, sig: any, webhookSecret: any) {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    if (!event) {
      throw new validationError(
        SubscriptionStatusMessage.WebHookVerificationFailed
      );
    }
    return event;
  }

  public async webHookHandler(
    sig: string,
    webhookSecret: string,
    body: any
  ): Promise<void> {
    this.validateWebhookInput(sig, webhookSecret, body);
    const event = this.constructStripeEvent(body, sig, webhookSecret);
    switch (event.type) {
      case "checkout.session.completed":
        const session = event?.data?.object;
        const userId = session?.client_reference_id;
        if (session?.metadata) {
          const subscriptionId = session.metadata?.subscriptionId;
          const trainerId = session?.metadata?.trainerId;
          const stripeSubscriptionId = session?.subscription as string;
          const subscription = await stripe.subscriptions.retrieve(
            stripeSubscriptionId
          );

          if (!subscriptionId || !trainerId) {
            throw new validationError(
              SubscriptionStatusMessage.SubscriptionIdAndTraineIdMissing
            );
          }
          const subscriptionData =
            await this.subscriptionRepository.findSubscriptionById(
              subscriptionId
            );
          if (!subscriptionData) {
            throw new validationError(
              SubscriptionStatusMessage.FailedToRetrieveSubscriptionDetails
            );
          }
          const newSubscriptionAdding = {
            userId: userId as string,
            trainerId: trainerId,
            subPeriod: subscriptionData?.subPeriod,
            price: subscriptionData?.price,
            durationInWeeks: subscriptionData?.durationInWeeks,
            sessionsPerWeek: subscriptionData?.sessionsPerWeek,
            totalSessions: subscriptionData?.totalSessions,
            stripePriceId: subscriptionData?.stripePriceId,
            stripeSubscriptionId: stripeSubscriptionId as string,
            stripeSubscriptionStatus: subscription.status,
          };
          const createdSubscription =
            await this.userSubscriptionPlanRepository.create(
              newSubscriptionAdding
            );

          if (createdSubscription) {
            const adminCommission = Math.round(subscriptionData?.price * 0.1);
            const platformFee = Math.round(subscriptionData?.price * 0.05);
            const trainerAmount =
              subscriptionData?.price - adminCommission - platformFee;

            await this.revenueRepository.create({
              userId: createdSubscription.userId.toString(),
              trainerId: trainerId,
              subscriptionId: subscriptionData._id.toString(),
              userSubscriptionPlanId: createdSubscription._id.toString(),
              amountPaid: subscriptionData.price,
              platformRevenue: platformFee,
              trainerRevenue: trainerAmount,
              commission: adminCommission,
            });

            const existingConversation =
              await this.conversationRepository.findConversation({
                userId: createdSubscription.userId.toString(),
                trainerId: trainerId,
              });

            if (!existingConversation) {
              await this.conversationRepository.createChatConversation({
                userId: createdSubscription.userId.toString(),
                trainerId: trainerId,
                stripeSubscriptionStatus: subscription.status,
              });
            } else {
              await this.conversationRepository.updateSubscriptionStatus({
                userId: createdSubscription.userId.toString(),
                trainerId: trainerId,
                stripeSubscriptionStatus: subscription.status,
              });
            }
          }
          console.log(
            `Subscription ${subscriptionId} successful in webhook handler`
          );
        }

        break;
      case "invoice.payment_failed":
        const invoice = event.data.object;
        const stripeSubscriptionId = invoice.subscription as string;

        if (stripeSubscriptionId) {
          const findExistingSubscription =
            await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionId(
              stripeSubscriptionId
            );
          const { userId, trainerId } = findExistingSubscription;
          if (findExistingSubscription) {
            await this.conversationRepository.updateSubscriptionStatus({
              userId: userId.toString(),
              trainerId: trainerId.toString(),
              stripeSubscriptionStatus: "canceled",
            });
          }
          await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionIdAndUpdateStatus(
            { stripeSubscriptionId, status: "canceled" }
          );
          console.log(
            `Subscription ${stripeSubscriptionId} cancelled due to payment failure`
          );
        }

        break;
      case "customer.subscription.deleted":
        const subscription = event.data.object;

        if (subscription) {
          const findExistingSubscription =
            await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionId(
              subscription.id
            );
          const { userId, trainerId } = findExistingSubscription;
          if (findExistingSubscription) {
            await this.conversationRepository.updateSubscriptionStatus({
              userId: userId.toString(),
              trainerId: trainerId.toString(),
              stripeSubscriptionStatus: "canceled",
            });
          }
          await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionIdAndUpdateStatus(
            { stripeSubscriptionId: subscription.id, status: "canceled" }
          );
          console.log(
            `Subscription ${subscription.id} cancelled due to customer cancellation`
          );
        }

        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  public async getSubscriptionDetailsBySessionId(
    sessionId: string
  ): Promise<SubscriptionPlanEntity & { isSubscribed: boolean }> {
    handleLogInfo("info", `stripe session id received for verification`, {
      sessionId,
    });
    if (!sessionId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const session = await getCheckoutSession(sessionId);
    if (!session) {
      throw new validationError(
        SubscriptionStatusMessage.InvalidSessionIdForStripe
      );
    }
    const stripeSubscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    const userTakenSubscription =
      await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionId(
        stripeSubscriptionId as string
      );

    if (!userTakenSubscription) {
      throw new validationError(
        SubscriptionStatusMessage.FailedToRetrieveSubscriptionDetails
      );
    }
    const stripeSubscription = await getSubscription(
      stripeSubscriptionId as string
    );
    const subscriptionStatus =
      stripeSubscription.status === "active" &&
      userTakenSubscription.stripeSubscriptionStatus === "active";

    return { ...userTakenSubscription, isSubscribed: subscriptionStatus };
  }

  public async getUserSubscriptionsData(
    userId: IdDTO,
    { page, limit, search, filters }: GetUserSubscriptionsQueryDTO
  ): Promise<{
    userSubscriptionsList: UserSubscriptionsList[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }

    const { userSubscriptionRecord, paginationData } =
      await this.userSubscriptionPlanRepository.findSubscriptionsOfUser(
        userId,
        { page, limit, search, filters }
      );
    if (!userSubscriptionRecord) {
      throw new validationError(
        SubscriptionStatusMessage.FailedToRetrieveSubscriptionDetails
      );
    }

    const userSubscriptionsList = await Promise.all(
      userSubscriptionRecord.map(async (sub) => {
        const stripeData = await getSubscriptionsData(sub.stripeSubscriptionId);
        return {
          ...sub,
          ...stripeData,
        };
      })
    );
    return {
      userSubscriptionsList: userSubscriptionsList,
      paginationData: paginationData,
    };
  }
  public async getTrainerSubscribedUsers(
    trainerId: IdDTO,
    { page, limit, search, filters }: GetTrainerSubscribersQueryDTO
  ): Promise<{
    trainerSubscribers: TrainerSubscribersList[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const { trainerSubscriberRecord, paginationData } =
      await this.userSubscriptionPlanRepository.findSubscriptionsOfTrainer(
        trainerId,
        { page, limit, search, filters }
      );
    if (!trainerSubscriberRecord) {
      throw new validationError(
        SubscriptionStatusMessage.FailedToRetrieveSubscriptionDetails
      );
    }

    const trainerSubscribers = await Promise.all(
      trainerSubscriberRecord.map(async (sub) => {
        const stripeData = await getSubscriptionsData(sub.stripeSubscriptionId);
        return {
          ...sub,
          ...stripeData,
        };
      })
    );

    return { trainerSubscribers: trainerSubscribers, paginationData };
  }

  public async cancelSubscription({
    stripeSubscriptionId,
    action,
  }: CancelSubscriptionDTO): Promise<{
    stripeSubscriptionId: string;
    isActive: string;
    cancelAction: string;
  }> {
    if (!stripeSubscriptionId || !action) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

    if (!stripeSub) {
      throw new validationError(AuthenticationStatusMessage.InvalidId);
    }
    if (action === "cancelImmediately") {
      const stripeSub = await cancelSubscription(stripeSubscriptionId);
      return {
        stripeSubscriptionId: stripeSub.id,
        isActive: stripeSub.status,
        cancelAction: action,
      };
    } else {
      throw new validationError("Invalid cancellation action");
    }
  }
  public async isUserSubscribedToTheTrainer({
    userId,
    trainerId,
  }: CheckSubscriptionStatusDTO): Promise<{
    trainerId: string;
    isSubscribed: boolean;
  }> {
    if (!userId || !trainerId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }

    const subscriptionData =
      await this.userSubscriptionPlanRepository.findSubscriptionsOfUserwithUserIdAndTrainerId(
        { userId, trainerId }
      );
    if (subscriptionData && subscriptionData.length > 0) {
      for (const sub of subscriptionData) {
        try {
          const stripeSubscription = await getSubscription(
            sub.stripeSubscriptionId
          );
          if (
            stripeSubscription.status === "active" &&
            sub.stripeSubscriptionStatus === "active"
          ) {
            return {
              trainerId: trainerId,
              isSubscribed: true,
            };
          }
        } catch (error) {
          console.log(
            `Error checking subscription ${sub.stripeSubscriptionId}:`,
            error
          );
        }
      }
    }
    return {
      trainerId: trainerId,
      isSubscribed: false,
    };
  }

  public async userMyTrainersList(
    userId: IdDTO,
    { page, limit, search }: GetUserTrainersListQueryDTO
  ): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }> {
    const { userTrainersList, paginationData } =
      await this.userSubscriptionPlanRepository.usersMyTrainersList(userId, {
        page,
        limit,
        search,
      });
    if (!userTrainersList) {
      throw new validationError("Failed to retrieve user trainers list");
    }
    return {
      userTrainersList: userTrainersList,
      paginationData: paginationData,
    };
  }
}
