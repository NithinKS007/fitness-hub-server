import { NextFunction, Request, Response } from "express-serve-static-core";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { SubscriptionUseCase } from "../../application/usecases/subscriptionUseCase";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/trainerRepository";
import { MongoUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/userSubscriptionRepository";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/subscriptionRepository";
import { MongoRevenueRepository } from "../../infrastructure/databases/repositories/revenueRepository";
import logger from "../../infrastructure/logger/logger";
import { handleLogError } from "../../shared/utils/handleLogError";

//MONGO REPOSITORY INSTANCES
const mongoSubscriptionRepository = new MongoSubscriptionRepository();
const mongoTrainerRepository = new MongoTrainerRepository();
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoRevenueRepository = new MongoRevenueRepository();

//USE CASE INSTANCES
const subscriptionUseCase = new SubscriptionUseCase(
  mongoSubscriptionRepository,
  mongoTrainerRepository,
  monogUserSubscriptionPlanRepository,
  mongoRevenueRepository
);

export class SubscriptionController {
  static async addSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const _id = req.user._id;
      const subscriptionData = await subscriptionUseCase.createSubscription({
        trainerId: _id,
        ...req.body,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        subscriptionData,
        HttpStatusMessages.SubscriptionCreated
      );
    } catch (error) {
       handleLogError(
        error,
        "SubscriptionController.addSubscription",
        "Error adding subscription"
      );
      next(error);
    }
  }

  static async getTrainerSubscriptions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const subscriptionsData =
        await subscriptionUseCase.getTrainerSubscriptions(trainerId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        subscriptionsData,
        HttpStatusMessages.SubscriptionsListRetrieved
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.getTrainerSubscriptions",
        "Error retrieving trainer subscriptions"
      );
      next(error);
    }
  }

  static async updateSubscriptionBlockStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subscriptionId = req.params.subscriptionId;
      const { isBlocked } = req.body;
      const updatedSubscriptionStatus =
        await subscriptionUseCase.updateSubscriptionBlockStatus({
          subscriptionId: subscriptionId,
          isBlocked,
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedSubscriptionStatus,
        HttpStatusMessages.SubscriptionBlockStatusUpdated
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.updateSubscriptionBlockStatus",
        "Error updating subscription block status"
      );
      next(error);
    }
  }

  static async editSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subscriptionId = req.params.subscriptionId;
      const trainerId = req.user._id;
      const editSubscriptionData = await subscriptionUseCase.editSubscription({
        trainerId: trainerId,
        subscriptionId,
        ...req.body,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        editSubscriptionData,
        HttpStatusMessages.EditedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.editSubscription",
        "Error editing subscription details"
      )
      next(error);
    }
  }

  static async deleteSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subscriptionId = req.params.subscriptionId;
      const deletedSubscriptionData =
        await subscriptionUseCase.deleteSubscription(subscriptionId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        deletedSubscriptionData,
        HttpStatusMessages.DeletedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.deleteSubscription",
        "Error deleting subscription"
      )
      next(error);
    }
  }

  static async purchaseSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const { subscriptionId } = req.body;
      const sessionId = await subscriptionUseCase.createStripeSession({
        userId: userId,
        subscriptionId,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { sessionId: sessionId },
        HttpStatusMessages.SubscriptionAddedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.purchaseSubscription",
        "Error purchasing subscription"
      )
      next(error);
    }
  }

  static async webHookHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRETKEY;
      if (typeof sig !== "string") {
        throw new Error("Stripe signature header is missing or invalid");
      }
      await subscriptionUseCase.webHookHandler(
        sig,
        webhookSecret as string,
        req.body
      );
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.SubscriptionAddedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.webHookHandler",
        "Error in webhook handler"
      )
      next(error);
    }
  }

  static async getSubscriptionDetailsBySessionId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionId } = req.params;
      const subscriptionData =
        await subscriptionUseCase.getSubscriptionDetailsBySessionId(sessionId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { subscriptionData: subscriptionData },
        HttpStatusMessages.SubscriptionAddedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.getSubscriptionDetailsBySessionId",
        "Error retrieving subscription details by session ID"
      )
      next(error);
    }
  }

  static async cancelSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { stripeSubscriptionId, action } = req.body;
      const subscriptionCancelledData =
        await subscriptionUseCase.cancelSubscription({
          stripeSubscriptionId,
          action,
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { subscriptionCancelledData: subscriptionCancelledData },
        HttpStatusMessages.SubscriptionCancelledSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.cancelSubscription",
        "Error canceling subscription"
      )
      next(error);
    }
  }

  static async getTrainerSubscribedUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { page, limit, search, filters } = req.query;
      const { trainerSubscribers, paginationData } =
        await subscriptionUseCase.getTrainerSubscribedUsers(trainerId, {
          page: page as string,
          search: search as string,
          limit: limit as string,
          filters: filters as string[],
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { trainerSubscribers, paginationData },
        HttpStatusMessages.SubscriptionsListRetrieved
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.getTrainerSubscribedUsers",
        "Error retrieving trainer's subscribed users list"
      )
      next(error);
    }
  }

  static async getUserSubscriptions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const { page, limit, search, filters } = req.query;
      const { userSubscriptionsList, paginationData } =
        await subscriptionUseCase.getUserSubscriptionsData(userId, {
          page: page as string,
          search: search as string,
          limit: limit as string,
          filters: filters as string[],
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { userSubscriptionsList, paginationData },
        HttpStatusMessages.SubscriptionListOfUserRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.getUserSubscriptions",
        "Error retrieving user's subscriptions"
      )
      next(error);
    }
  }

  static async isSubscribedToTheTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const trainerId = req.params._id;
      const isUserSubscribedToTheTrainer =
        await subscriptionUseCase.isUserSubscribedToTheTrainer({
          userId,
          trainerId,
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { isUserSubscribedToTheTrainer },
        HttpStatusMessages.UserIsSubscribed
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.isSubscribedToTheTrainer",
        "Error checking user's subscription status"
      )
      next(error);
    }
  }

  static async getMyTrainers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const { page, limit, search } = req.query;
      const { userTrainersList, paginationData } =
        await subscriptionUseCase.userMyTrainersList(userId, {
          page: page as string,
          search: search as string,
          limit: limit as string,
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { userTrainersList, paginationData },
        HttpStatusMessages.TrainersListRetrieved
      );
    } catch (error) {
      handleLogError(
        error,
        "SubscriptionController.getMyTrainers",
        "Error to retrieve my trainersList"
      )
      next(error);
    }
  }
}
