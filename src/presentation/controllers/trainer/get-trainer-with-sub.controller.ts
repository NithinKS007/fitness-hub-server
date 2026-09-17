import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, TrainerStatus } from "@shared/constants/index.constants";
import { TYPES_TRAINER_USECASES } from "@di/types-usecases";
import { IGetTrainerAndSubInfoUC } from "@application/interfaces/usecases/ITrainerUC";

@injectable()
export class GetTrainerWithSubController {
  constructor(
    @inject(TYPES_TRAINER_USECASES.GetTrainerAndSubInfoUseCase)
    private getTrainerAndSubInfoUseCase: IGetTrainerAndSubInfoUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: trainerId } = req.params;

    const trainersData = await this.getTrainerAndSubInfoUseCase.execute(
      trainerId
    );

    sendResponse(
      res,
      StatusCodes.OK,
      trainersData,
      TrainerStatus.ListRetrieved
    );
  }
}
