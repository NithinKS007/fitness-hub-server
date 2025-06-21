import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, WorkoutStatus } from "@shared/constants/index.constants";
import { GetWorkoutUseCase } from "@application/usecases/workout/get-workout.usecase";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_WORKOUT_USECASES } from "@di/types-usecases";

@injectable()
export class GetWorkoutController {
  constructor(
    @inject(TYPES_WORKOUT_USECASES.GetWorkoutUseCase)
    private getWorkoutUseCase: GetWorkoutUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { workoutList, paginationData } =
      await this.getWorkoutUseCase.execute(userId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { workoutList: workoutList, paginationData: paginationData },
      WorkoutStatus.Retrieved
    );
  }
}
