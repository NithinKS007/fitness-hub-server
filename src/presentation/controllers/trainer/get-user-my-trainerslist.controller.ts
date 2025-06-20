import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, TrainerStatus } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { GetUserTrainerslistUseCase } from "@application/usecases/subscription/get-user-trainers-list.usecase";
import { TYPES_SUBSCRIPTION_USECASES } from "di/types-usecases";

@injectable()
export class GetUserMyTrainersController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.GetUserTrainerslistUseCase)
    private getUserTrainerslistUseCase: GetUserTrainerslistUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const { userTrainersList, paginationData } =
      await this.getUserTrainerslistUseCase.execute(
        userId,
        parseQueryParams(req.query)
      );

    sendResponse(
      res,
      StatusCodes.OK,
      { userTrainersList, paginationData },
      TrainerStatus.TrainersListRetrieved
    );
  }
}
