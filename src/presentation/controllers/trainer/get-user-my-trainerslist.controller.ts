import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, TrainerStatus } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_SUBSCRIPTION_USECASES } from "@di/types-usecases";
import { IGetUserTrainerslistUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class GetUserMyTrainersController {
  constructor(
    @inject(TYPES_SUBSCRIPTION_USECASES.GetUserTrainerslistUseCase)
    private getUserTrainerslistUseCase: IGetUserTrainerslistUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const { userTrainersList, paginationData } =
      await this.getUserTrainerslistUseCase.execute({
        userId,
        ...parseQueryParams(req.query),
      });

    sendResponse(
      res,
      StatusCodes.OK,
      { userTrainersList, paginationData },
      TrainerStatus.ListRetrieved
    );
  }
}
