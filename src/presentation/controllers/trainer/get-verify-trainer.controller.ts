import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { TrainerStatus, StatusCodes } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { GetVerifyTrainerlistUseCase } from "@application/usecases/trainer/get-verify-trainer-list.usecase";
import { TYPES_TRAINER_USECASES } from "di/types-usecases";

@injectable()
export class GetVerifyTrainerController {
  constructor(
    @inject(TYPES_TRAINER_USECASES.GetVerifyTrainerlistUseCase)
    private getVerifyTrainerlistUseCase: GetVerifyTrainerlistUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { trainersList, paginationData } =
      await this.getVerifyTrainerlistUseCase.execute(
        parseQueryParams(req.query)
      );

    sendResponse(
      res,
      StatusCodes.OK,
      { trainersList: trainersList, paginationData: paginationData },
      TrainerStatus.TrainersListRetrieved
    );
  }
}
