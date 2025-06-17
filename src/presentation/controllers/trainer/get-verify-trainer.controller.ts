import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { TrainerStatus, StatusCodes } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse.queryParams";
import { GetVerifyTrainerlistUseCase } from "@application/usecases/trainer/get-verify-trainer-list.usecase";

export class GetVerifyTrainerController {
  constructor(
    private getVerifyTrainerlistUseCase: GetVerifyTrainerlistUseCase
  ) {}

  async handleGetVerifyPendingList(req: Request, res: Response): Promise<void> {
    const { trainersList, paginationData } =
      await this.getVerifyTrainerlistUseCase.execute(
        parseQueryParams(req.query)
      );

    sendResponse(
      res,
      StatusCodes.OK,
      { trainersList: trainersList, paginationData: paginationData },
      TrainerStatus.TrainersListRetrieved
    );
  }
}
