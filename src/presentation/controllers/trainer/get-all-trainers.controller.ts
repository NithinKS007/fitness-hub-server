import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { TrainerStatus, StatusCodes } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse.queryParams";
import { GetTrainersUseCase } from "@application/usecases/trainer/get-trainers-usecase";

export class GetallTrainersController {
  constructor(private getTrainersUseCase: GetTrainersUseCase) {}

  async handleGetTrainers(req: Request, res: Response): Promise<void> {
    const { trainersList, paginationData } =
      await this.getTrainersUseCase.execute(parseQueryParams(req.query));

    sendResponse(
      res,
      StatusCodes.OK,
      { trainersList: trainersList, paginationData },
      TrainerStatus.TrainersListRetrieved
    );
  }
}
