import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  TrainerStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { TrainerGetUseCase } from "../../../application/usecases/trainer/get-trainer.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class GetallTrainersController {
  constructor(private trainerGetUseCase: TrainerGetUseCase) {}
  async getTrainers(req: Request, res: Response): Promise<void> {
    const { trainersList, paginationData } =
      await this.trainerGetUseCase.getTrainers(parseQueryParams(req.query));
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { trainersList: trainersList, paginationData },
      TrainerStatus.TrainersListRetrieved
    );
  }
}
