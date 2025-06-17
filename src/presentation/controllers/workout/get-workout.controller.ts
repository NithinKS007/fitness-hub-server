import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, WorkoutStatus } from "@shared/constants/index.constants";
import { GetWorkoutUseCase } from "@application/usecases/workout/get-workout.usecase";
import { parseQueryParams } from "@shared/utils/parse.queryParams";

export class GetWorkoutController {
  constructor(private getWorkoutUseCase: GetWorkoutUseCase) {}

  async handleGetWorkout(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { workoutList, paginationData } =
      await this.getWorkoutUseCase.execute(userId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { workoutList: workoutList, paginationData: paginationData },
      WorkoutStatus.WorkoutRetrievedSuccess
    );
  }
}
