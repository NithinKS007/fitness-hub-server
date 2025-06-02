import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  SubscriptionStatus,
} from "../../../shared/constants/index.constants";
import { CreateSubscriptionUseCase } from "../../../application/usecases/subscription/create-subscription.usecase";
import { EditSubscriptionUseCase } from "../../../application/usecases/subscription/edit-subscription.usecase";
import { DeleteSubscriptionUseCase } from "../../../application/usecases/subscription/delete-subscription.usecase";
import { SubscriptionBlockUseCase } from "../../../application/usecases/subscription/block-subscription.usecase";

export class SubscriptionPlanController {
  constructor(
    private createSubscriptionUseCase: CreateSubscriptionUseCase,
    private editSubscriptionUseCase: EditSubscriptionUseCase,
    private deleteSubscriptionUseCase: DeleteSubscriptionUseCase,
    private subscriptionBlockUseCase: SubscriptionBlockUseCase
  ) {}

  async addSubscription(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const subscriptionData =
      await this.createSubscriptionUseCase.createSubscription({
        trainerId,
        ...req.body,
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      subscriptionData,
      SubscriptionStatus.SubscriptionCreated
    );
  }
  async updateSubscriptionBlockStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    const updatedSubData = {
      subscriptionId: req.params.subscriptionId,
      isBlocked: req.body.isBlocked,
    };
    const updatedSubscriptionStatus =
      await this.subscriptionBlockUseCase.updateSubscriptionBlockStatus(
        updatedSubData
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      updatedSubscriptionStatus,
      SubscriptionStatus.SubscriptionBlockStatusUpdated
    );
  }
  async editSubscription(req: Request, res: Response): Promise<void> {
    const subscriptionId = req.params.subscriptionId;
    const trainerId = req?.user?._id;
    const editSubscriptionData =
      await this.editSubscriptionUseCase.editSubscription({
        trainerId: trainerId,
        subscriptionId,
        ...req.body,
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      editSubscriptionData,
      SubscriptionStatus.SubscriptionEditedSuccessfully
    );
  }
  async deleteSubscription(req: Request, res: Response): Promise<void> {
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
