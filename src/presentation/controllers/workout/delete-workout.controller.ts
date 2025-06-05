import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  WorkoutStatus,
} from "../../../shared/constants/index.constants";
import { DeleteWorkoutUseCase } from "../../../application/usecases/workout/delete-workout-usecase";

export class DeleteWorkoutController {
  constructor(private deleteWorkoutUseCase: DeleteWorkoutUseCase) {}
  async handleDeleteWorkout(req: Request, res: Response): Promise<void> {
    const { setId } = req.params;
    const deletedWorkoutSet = await this.deleteWorkoutUseCase.execute(setId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      deletedWorkoutSet,
      WorkoutStatus.WorkoutSetDeleted
    );
  }
}
