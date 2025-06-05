import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  WorkoutStatus,
} from "../../../shared/constants/index.constants";
import { GetWorkoutUseCase } from "../../../application/usecases/workout/get-workout.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class GetWorkoutController {
  constructor(private getWorkoutUseCase: GetWorkoutUseCase) {}
  async handleGetWorkout(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { workoutList, paginationData } =
      await this.getWorkoutUseCase.execute(userId, queryParams);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { workoutList: workoutList, paginationData: paginationData },
      WorkoutStatus.WorkoutListRetrievedSuccessfully
    );
  }
}
