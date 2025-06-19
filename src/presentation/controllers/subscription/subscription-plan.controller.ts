import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  StatusCodes,
  SubscriptionStatus,
} from "@shared/constants/index.constants";
import { CreateSubscriptionUseCase } from "@application/usecases/subscription/create-subscription.usecase";
import { EditSubscriptionUseCase } from "@application/usecases/subscription/edit-subscription.usecase";
import { DeleteSubscriptionUseCase } from "@application/usecases/subscription/delete-subscription.usecase";
import { SubscriptionBlockUseCase } from "@application/usecases/subscription/block-subscription.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "di/types-usecases";

@injectable()
export class SubscriptionPlanController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.CreateSubscriptionUseCase)
    private createSubscriptionUseCase: CreateSubscriptionUseCase,

    @inject(TYPES_SUBSCRIPTION_USECASES.EditSubscriptionUseCase)
    private editSubscriptionUseCase: EditSubscriptionUseCase,

    @inject(TYPES_SUBSCRIPTION_USECASES.DeleteSubscriptionUseCase)
    private deleteSubscriptionUseCase: DeleteSubscriptionUseCase,

    @inject(TYPES_SUBSCRIPTION_USECASES.SubscriptionBlockUseCase)
    private subscriptionBlockUseCase: SubscriptionBlockUseCase
  ) {}

  async addSubscription(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const subscriptionData = await this.createSubscriptionUseCase.execute({
      trainerId,
      ...req.body,
    });

    sendResponse(
      res,
      StatusCodes.OK,
      subscriptionData,
      SubscriptionStatus.SubscriptionCreated
    );
  }

  async updateSubscriptionBlockStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    const { subscriptionId } = req.params;
    const { isBlocked } = req.body;

    const updatedSubData = {
      subscriptionId,
      isBlocked,
    };

    const updatedSubscriptionStatus =
      await this.subscriptionBlockUseCase.execute(updatedSubData);

    sendResponse(
      res,
      StatusCodes.OK,
      updatedSubscriptionStatus,
      SubscriptionStatus.SubscriptionBlockStatusUpdated
    );
  }

  async editSubscription(req: Request, res: Response): Promise<void> {
    const { subscriptionId } = req.params;
    const { _id: trainerId } = req?.user || {};

    const editSubscriptionData = await this.editSubscriptionUseCase.execute({
      trainerId: trainerId,
      subscriptionId,
      ...req.body,
    });

    sendResponse(
      res,
      StatusCodes.OK,
      editSubscriptionData,
      SubscriptionStatus.SubscriptionEditedSuccessfully
    );
  }

  async deleteSubscription(req: Request, res: Response): Promise<void> {
    const { subscriptionId } = req.params;

    const deletedSubscriptionData =
      await this.deleteSubscriptionUseCase.execute(subscriptionId);

    sendResponse(
      res,
      StatusCodes.OK,
      deletedSubscriptionData,
      SubscriptionStatus.SubscriptionDeletedSuccessfully
    );
  }
}
