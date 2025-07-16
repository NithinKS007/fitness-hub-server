import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { TrainerStatus, StatusCodes } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_TRAINER_USECASES } from "@di/types-usecases";
import { IGetTrainersUC } from "@application/interfaces/usecases/ITrainerUC";

@injectable()
export class GetallTrainersController {
  constructor(
    @inject(TYPES_TRAINER_USECASES.GetTrainersUseCase)
    private getTrainersUseCase: IGetTrainersUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { trainersList, paginationData } =
      await this.getTrainersUseCase.execute(parseQueryParams(req.query));

    sendResponse(
      res,
      StatusCodes.OK,
      { trainersList: trainersList, paginationData },
      TrainerStatus.ListRetrieved
    );
  }
}
