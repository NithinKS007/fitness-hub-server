import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, WorkoutStatus } from "@shared/constants/index.constants";
import { CreateWorkoutUseCase } from "@application/usecases/workout/create-workout.usecase";
import { TYPES_WORKOUT_USECASES } from "di/types-usecases";

@injectable()
export class AddWorkoutController {
  constructor(
    @inject(TYPES_WORKOUT_USECASES.CreateWorkoutUseCase)
    private createWorkoutUseCase: CreateWorkoutUseCase
  ) {}

  async handleAddWorkout(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const addedWorkOut = await this.createWorkoutUseCase.execute(
      userId,
      req.body
    );

    sendResponse(res, StatusCodes.OK, addedWorkOut, WorkoutStatus.Added);
  }
}
