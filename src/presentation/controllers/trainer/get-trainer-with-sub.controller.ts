import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, TrainerStatus } from "@shared/constants/index.constants";
import { GetTrainerAndSubInfoUseCase } from "@application/usecases/trainer/get-trainer-with-subscription";
import { TYPES_TRAINER_USECASES } from "di/types-usecases";

@injectable()
export class GetTrainerWithSubController {
  constructor(
    @inject(TYPES_TRAINER_USECASES.GetTrainerAndSubInfoUseCase)
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
