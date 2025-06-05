import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  TrainerStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { TrainerGetUseCase } from "../../../application/usecases/trainer/get-trainer.usecase";

export class GetTrainerDetailsController {
  constructor(private trainerGetUseCase: TrainerGetUseCase) {}
  async handleGetTrainerDetails(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId;
    const trainerData = await this.trainerGetUseCase.getTrainerDetailsById(
      trainerId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      trainerData,
      TrainerStatus.TrainerDetailsRetrieved
    );
  }
}
