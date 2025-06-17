import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, TrainerStatus } from "@shared/constants/index.constants";
import { GetTrainerAndSubInfoUseCase } from "@application/usecases/trainer/get-trainer-with-subscription";

export class GetTrainerWithSubController {
  constructor(
    private getTrainerAndSubInfoUseCase: GetTrainerAndSubInfoUseCase
  ) {}

  async handleGetTrainerWithSub(req: Request, res: Response): Promise<void> {
    const { trainerId } = req.params;

    const trainersData = await this.getTrainerAndSubInfoUseCase.execute(
      trainerId
    );

    sendResponse(res, StatusCodes.OK, trainersData, TrainerStatus.TrainersList);
  }
}
