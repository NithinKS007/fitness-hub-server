import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  WorkoutStatus,
} from "../../../shared/constants/index.constants";
import { CreateWorkoutUseCase } from "../../../application/usecases/workout/create-workout.usecase";

export class AddWorkoutController {
  constructor(private createWorkoutUseCase: CreateWorkoutUseCase) {}
  async handleAddWorkout(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
    const addedWorkOut = await this.createWorkoutUseCase.execute(
      userId,
      req.body
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      addedWorkOut,
      WorkoutStatus.workoutAddedSuccessfully
    );
  }
}
