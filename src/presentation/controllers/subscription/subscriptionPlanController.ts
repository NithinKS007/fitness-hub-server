import { Request, Response } from "express";
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
import { DeleteSubscriptionUseCase } from "../../../application/usecases/subscription/deleteSubscriptionUseCase";
import { SubscriptionBlockUseCase } from "../../../application/usecases/subscription/blockSubscriptionUseCase";

export class SubscriptionPlanController {
  constructor(
    private createSubscriptionUseCase: CreateSubscriptionUseCase,
    private editSubscriptionUseCase: EditSubscriptionUseCase,
    private deleteSubscriptionUseCase: DeleteSubscriptionUseCase,
    private subscriptionBlockUseCase: SubscriptionBlockUseCase
  ) {}

  public async addSubscription(req: Request, res: Response): Promise<void> {
    const _id = req.user._id;
    const subscriptionData = await this.createSubscriptionUseCase.createSubscription(
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
  public async updateSubscriptionBlockStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    const subscriptionId = req.params.subscriptionId;
    const { isBlocked } = req.body;
    const updatedSubscriptionStatus =
      await this.subscriptionBlockUseCase.updateSubscriptionBlockStatus({
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
  public async editSubscription(req: Request, res: Response): Promise<void> {
    const subscriptionId = req.params.subscriptionId;
    const trainerId = req.user._id;
    const editSubscriptionData = await this.editSubscriptionUseCase.editSubscription(
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
  public async deleteSubscription(req: Request, res: Response): Promise<void> {
    const subscriptionId = req.params.subscriptionId;
    const deletedSubscriptionData =
      await this.deleteSubscriptionUseCase.deleteSubscription(subscriptionId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      deletedSubscriptionData,
      SubscriptionStatus.SubscriptionDeletedSuccessfully
    );
  }
}
