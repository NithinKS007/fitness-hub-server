import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { TrainerStatus, StatusCodes } from "@shared/constants/index.constants";
import { GetTrainerDetailsUseCase } from "@application/usecases/trainer/get-trainer-details.usecase";

export class GetTrainerDetailsController {
  constructor(private getTrainerDetailsUseCase: GetTrainerDetailsUseCase) {}

  async handleGetTrainerDetails(req: Request, res: Response): Promise<void> {
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
