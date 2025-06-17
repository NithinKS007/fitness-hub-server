import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, WorkoutStatus } from "@shared/constants/index.constants";
import { CompleteWorkoutUseCase } from "@application/usecases/workout/complete-workout.usecase";

export class UpdateWorkoutController {
  constructor(private completeWorkoutUseCase: CompleteWorkoutUseCase) {}

  async handlWorkoutComplete(req: Request, res: Response): Promise<void> {
    const { setId } = req.params;

    const completedWorkoutSet = await this.completeWorkoutUseCase.execute(
      setId
    );

    sendResponse(
      res,
      StatusCodes.OK,
      completedWorkoutSet,
      WorkoutStatus.WorkoutSetCompleted
    );
  }
}
