import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  DashboardStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_DASHBOARD_USECASES } from "@di/types-usecases";
import { IUserDashBoardUC } from "@application/interfaces/usecases/IDashBoardUC";

@injectable()
export class UserDashboardController {
  constructor(
    @inject(TYPES_DASHBOARD_USECASES.UserDashBoardUseCase)
    private userDashBoardUseCase: IUserDashBoardUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: userId } = req?.user || {};

    const {
      weightLiftedByDate,
      totalCompletedWorkouts,
      totalPendingWorkouts,
      totalWorkoutTime,
    } = await this.userDashBoardUseCase.execute({
      userId,
      ...parseQueryParams(req.query),
    });

    sendResponse(
      res,
      StatusCodes.OK,
      {
        totalCompletedWorkouts: totalCompletedWorkouts,
        totalPendingWorkouts: totalPendingWorkouts,
        weightLiftedByDate: weightLiftedByDate,
        totalWorkoutTime: totalWorkoutTime,
      },
      DashboardStatus.UserDashRetrieved
    );
  }
}
