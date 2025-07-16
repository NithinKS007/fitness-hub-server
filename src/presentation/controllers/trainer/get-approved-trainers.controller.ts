import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, TrainerStatus } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_TRAINER_USECASES } from "@di/types-usecases";
import { IGetApprovedTrainers } from "@application/interfaces/usecases/ITrainerUC";

@injectable()
export class GetApprovedTrainersController {
  constructor(
    @inject(TYPES_TRAINER_USECASES.GetApprovedTrainersUseCase)
    private getApprovedTrainersUseCase: IGetApprovedTrainers
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { trainersList, paginationData } =
      await this.getApprovedTrainersUseCase.execute(
        parseQueryParams(req.query)
      );
    sendResponse(
      res,
      StatusCodes.OK,
      { trainersList, paginationData },
      TrainerStatus.ListRetrieved
    );
  }
}
