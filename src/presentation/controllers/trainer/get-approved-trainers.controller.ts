import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, TrainerStatus } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse.queryParams";
import { GetApprovedTrainersUseCase } from "@application/usecases/trainer/get-approved-trainers.usecase";

export class GetApprovedTrainersController {
  constructor(private getApprovedTrainersUseCase: GetApprovedTrainersUseCase) {}

  async handleGetApprovedTrainers(req: Request, res: Response): Promise<void> {
    const { trainersList, paginationData } =
      await this.getApprovedTrainersUseCase.execute(
        parseQueryParams(req.query)
      );

    sendResponse(
      res,
      StatusCodes.OK,
      { trainersList, paginationData },
      TrainerStatus.TrainersList
    );
  }
}
