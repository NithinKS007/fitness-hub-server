import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  TrainerStatus,
} from "../../../shared/constants/index.constants";
import { GetUserSubscriptionUseCase } from "../../../application/usecases/subscription/get-user-subscription.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class GetUserMyTrainersController {
  constructor(private getUserSubscriptionUseCase: GetUserSubscriptionUseCase) {}
  async getMyTrainers(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
    const { userTrainersList, paginationData } =
      await this.getUserSubscriptionUseCase.userMyTrainersList(
        userId,
        parseQueryParams(req.query)
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { userTrainersList, paginationData },
      TrainerStatus.TrainersListRetrieved
    );
  }
}
