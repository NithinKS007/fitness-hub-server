import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  WorkoutStatus,
} from "../../../shared/constants/index.constants";
import { UpdateWorkoutUseCase } from "../../../application/usecases/workout/update-workout.usecase";

export class DeleteWorkoutController {
  constructor(private updateWorkoutUseCase: UpdateWorkoutUseCase) {}
  async deleteWorkoutSet(req: Request, res: Response): Promise<void> {
    const { setId } = req.params;
    const deletedWorkoutSet = await this.updateWorkoutUseCase.deleteWorkoutSet(
      setId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      deletedWorkoutSet,
      WorkoutStatus.WorkoutSetDeleted
    );
  }
}
