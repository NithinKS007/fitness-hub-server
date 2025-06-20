import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { TrainerStatus, StatusCodes } from "@shared/constants/index.constants";
import { GetTrainerDetailsUseCase } from "@application/usecases/trainer/get-trainer-details.usecase";
import { TYPES_TRAINER_USECASES } from "di/types-usecases";

@injectable()
export class GetTrainerDetailsController {
  constructor(
    @inject(TYPES_TRAINER_USECASES.GetTrainerDetailsUseCase)
    private getTrainerDetailsUseCase: GetTrainerDetailsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { trainerId } = req.params;

    const trainerData = await this.getTrainerDetailsUseCase.execute(trainerId);

    sendResponse(
      res,
      StatusCodes.OK,
      trainerData,
      TrainerStatus.TrainerDetailsRetrieved
    );
  }
}
