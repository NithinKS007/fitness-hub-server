import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, TrainerStatus } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse.queryParams";
import { GetUserTrainerslistUseCase } from "@application/usecases/subscription/get-user-trainers-list.usecase";

export class GetUserMyTrainersController {
  constructor(private getUserTrainerslistUseCase: GetUserTrainerslistUseCase) {}

  async handleGetMyTrainers(req: Request, res: Response): Promise<void> {
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
