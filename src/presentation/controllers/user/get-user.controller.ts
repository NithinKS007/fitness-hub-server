import { Request, response, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  UserStatus,
  StatusCodes,
  TrainerStatus,
} from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_TRAINER_USECASES, TYPES_USER_USECASES } from "@di/types-usecases";
import { IGetUsersUC } from "@application/interfaces/usecases/IUserUC";
import { IGetTrainersUC } from "@application/interfaces/usecases/ITrainerUC";

@injectable()
export class GetUsersController {
  constructor(
    @inject(TYPES_USER_USECASES.GetUsersUseCase)
    private getUsersUseCase: IGetUsersUC,
    @inject(TYPES_TRAINER_USECASES.GetTrainersUseCase)
    private getTrainersUseCase: IGetTrainersUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const parsedParams = parseQueryParams(req.query);

    if (parsedParams.view === "users") {
      const response = await this.getUsersUseCase.execute(parsedParams);
      sendResponse(res, StatusCodes.OK, response, UserStatus.UserList);
      return;
    }

    if (parsedParams.view === "trainers") {
      const response = await this.getTrainersUseCase.execute(parsedParams);
      sendResponse(res, StatusCodes.OK, response, TrainerStatus.FetchedList);
      return;
    }
  }
}
