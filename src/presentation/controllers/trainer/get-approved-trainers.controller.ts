import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  TrainerStatus,
} from "../../../shared/constants/index.constants";
import { TrainerGetUseCase } from "../../../application/usecases/trainer/get-trainer.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class GetApprovedTrainersController {
  constructor(private trainerGetUseCase: TrainerGetUseCase) {}
  async handleGetApprovedTrainers(req: Request, res: Response): Promise<void> {
    const { trainersList, paginationData } =
      await this.trainerGetUseCase.getApprovedTrainers(
        parseQueryParams(req.query)
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { trainersList, paginationData },
      TrainerStatus.TrainersList
    );
  }
}
