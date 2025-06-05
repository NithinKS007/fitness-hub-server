import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  TrainerStatus,
} from "../../../shared/constants/index.constants";
import { TrainerGetUseCase } from "../../../application/usecases/trainer/get-trainer.usecase";

export class GetTrainerWithSubController {
  constructor(private trainerGetUseCase: TrainerGetUseCase) {}
  async handleGetTrainerWithSub(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId;
    const trainersData = await this.trainerGetUseCase.getTrainerWithSub(
      trainerId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      trainersData,
      TrainerStatus.TrainersList
    );
  }
}
