import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  WorkoutStatus,
} from "../../../shared/constants/index.constants";
import { UpdateWorkoutUseCase } from "../../../application/usecases/workout/update-workout.usecase";

export class UpdateWorkoutController {
  constructor(private updateWorkoutUseCase: UpdateWorkoutUseCase) {}
  async markSetAsCompleted(req: Request, res: Response): Promise<void> {
    const { setId } = req.params;
    const completedWorkoutSet =
      await this.updateWorkoutUseCase.markSetAsCompleted(setId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      completedWorkoutSet,
      WorkoutStatus.WorkoutSetCompleted
    );
  }
}
