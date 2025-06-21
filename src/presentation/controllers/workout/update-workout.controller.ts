import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, WorkoutStatus } from "@shared/constants/index.constants";
import { CompleteWorkoutUseCase } from "@application/usecases/workout/complete-workout.usecase";
import { TYPES_WORKOUT_USECASES } from "@di/types-usecases";

@injectable()
export class UpdateWorkoutController {
  constructor(
    @inject(TYPES_WORKOUT_USECASES.CompleteWorkoutUseCase)
    private completeWorkoutUseCase: CompleteWorkoutUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { setId } = req.params;

    const workoutSet = await this.completeWorkoutUseCase.execute(setId);

    sendResponse(res, StatusCodes.OK, workoutSet, WorkoutStatus.Completed);
  }
}
