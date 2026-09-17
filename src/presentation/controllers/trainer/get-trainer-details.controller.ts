import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { TrainerStatus, StatusCodes } from "@shared/constants/index.constants";
import { TYPES_TRAINER_USECASES } from "@di/types-usecases";
import { IGetTrainerDetailsUC } from "@application/interfaces/usecases/ITrainerUC";

@injectable()
export class GetTrainerDetailsController {
  constructor(
    @inject(TYPES_TRAINER_USECASES.GetTrainerDetailsUseCase)
    private getTrainerDetailsUseCase: IGetTrainerDetailsUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: trainerId } = req.params;

    const trainerData = await this.getTrainerDetailsUseCase.execute(trainerId);

    sendResponse(
      res,
      StatusCodes.OK,
      trainerData,
      TrainerStatus.TrainerDetailsRetrieved
    );
  }
}
