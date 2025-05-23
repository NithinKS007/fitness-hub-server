import { Request, Response } from "express-serve-static-core";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index-constants";
import { MongoTrainerRepository } from "../../../infrastructure/databases/repositories/trainerRepository";
import { MongoSubscriptionRepository } from "../../../infrastructure/databases/repositories/subscriptionRepository";
import { StripePaymentService } from "../../../infrastructure/services/payments/stripeServices";
import { CreateSubscriptionUseCase } from "../../../application/usecases/subscription/createSubscriptionUseCase";
import { EditSubscriptionUseCase } from "../../../application/usecases/subscription/editSubscriptionUseCase";
import { DeleteSubscription } from "../../../application/usecases/subscription/deleteSubscriptionUseCase";
import { SubscriptionBlockUseCase } from "../../../application/usecases/subscription/blockSubscriptionUseCase";

//MONGO REPOSITORY INSTANCES
const mongoSubscriptionRepository = new MongoSubscriptionRepository();
const mongoTrainerRepository = new MongoTrainerRepository();

//SERVICE INSTANCES
const stripeService = new StripePaymentService();

//USE CASE INSTANCES
const createSubscriptionUseCase = new CreateSubscriptionUseCase(
  mongoSubscriptionRepository,
  mongoTrainerRepository,
  stripeService
);

const editSubscriptionUseCase = new EditSubscriptionUseCase(
  mongoSubscriptionRepository,
  mongoTrainerRepository,
  stripeService
);

const deleteSubscriptionUseCase = new DeleteSubscription(
  mongoSubscriptionRepository,
  stripeService
);

const subscriptionBlockUseCase = new SubscriptionBlockUseCase(
  mongoSubscriptionRepository
);

export class SubscriptionPlanController {
  static async addSubscription(req: Request, res: Response): Promise<void> {
    const _id = req.user._id;
    const subscriptionData = await createSubscriptionUseCase.createSubscription(
      {
        trainerId: _id,
        ...req.body,
      }
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      subscriptionData,
      SubscriptionStatus.SubscriptionCreated
    );
  }
  static async updateSubscriptionBlockStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    const subscriptionId = req.params.subscriptionId;
    const { isBlocked } = req.body;
    const updatedSubscriptionStatus =
      await subscriptionBlockUseCase.updateSubscriptionBlockStatus({
        subscriptionId: subscriptionId,
        isBlocked,
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      updatedSubscriptionStatus,
      SubscriptionStatus.SubscriptionBlockStatusUpdated
    );
  }
  static async editSubscription(req: Request, res: Response): Promise<void> {
    const subscriptionId = req.params.subscriptionId;
    const trainerId = req.user._id;
    const editSubscriptionData = await editSubscriptionUseCase.editSubscription(
      {
        trainerId: trainerId,
        subscriptionId,
        ...req.body,
      }
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      editSubscriptionData,
      SubscriptionStatus.SubscriptionEditedSuccessfully
    );
  }
  static async deleteSubscription(req: Request, res: Response): Promise<void> {
    const subscriptionId = req.params.subscriptionId;
    const deletedSubscriptionData =
      await deleteSubscriptionUseCase.deleteSubscription(subscriptionId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      deletedSubscriptionData,
      SubscriptionStatus.SubscriptionDeletedSuccessfully
    );
  }
}
