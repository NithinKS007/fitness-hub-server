import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, WorkoutStatus } from "@shared/constants/index.constants";
import { TYPES_WORKOUT_USECASES } from "@di/types-usecases";
import { IDeleteWorkoutUC } from "@application/interfaces/usecases/IWorkoutUC";

@injectable()
export class DeleteWorkoutController {
  constructor(
    @inject(TYPES_WORKOUT_USECASES.DeleteWorkoutUseCase)
    private deleteWorkoutUseCase: IDeleteWorkoutUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: setId } = req.params;

    const deletedWorkoutSet = await this.deleteWorkoutUseCase.execute(setId);

    sendResponse(res, StatusCodes.OK, deletedWorkoutSet, WorkoutStatus.Deleted);
  }
}
