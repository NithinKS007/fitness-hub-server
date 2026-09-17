import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, WorkoutStatus } from "@shared/constants/index.constants";
import { TYPES_WORKOUT_USECASES } from "@di/types-usecases";
import { ICreateWorkoutUC } from "@application/interfaces/usecases/IWorkoutUC";

@injectable()
export class AddWorkoutController {
  constructor(
    @inject(TYPES_WORKOUT_USECASES.CreateWorkoutUseCase)
    private createWorkoutUseCase: ICreateWorkoutUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const addedWorkOut = await this.createWorkoutUseCase.execute({
      userId,
      ...req.body,
    });

    sendResponse(res, StatusCodes.Created, addedWorkOut, WorkoutStatus.Added);
  }
}
