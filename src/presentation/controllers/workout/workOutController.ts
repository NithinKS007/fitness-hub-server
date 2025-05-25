import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  WorkoutStatus,
} from "../../../shared/constants/index-constants";
import { CreateWorkoutUseCase } from "../../../application/usecases/workout/createWorkoutUseCase";
import { GetWorkoutUseCase } from "../../../application/usecases/workout/getWorkoutUseCase";
import { UpdateWorkoutUseCase } from "../../../application/usecases/workout/updateWorkoutUseCase";

export class WorkoutController {
  constructor(
    private createWorkoutUseCase: CreateWorkoutUseCase,
    private getWorkoutUseCase: GetWorkoutUseCase,
    private updateWorkoutUseCase: UpdateWorkoutUseCase
  ) {}
  public async addWorkout(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;
    const addedWorkOut = await this.createWorkoutUseCase.addWorkout(
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

  public async getWorkoutsByUserId(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { workoutList, paginationData } =
      await this.getWorkoutUseCase.getWorkoutsByUserId(userId, {
        fromDate: fromDate as any,
        toDate: toDate as any,
        page: page as string,
        limit: limit as string,
        search: search as string,
        filters: filters as string[],
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { workoutList: workoutList, paginationData: paginationData },
      WorkoutStatus.WorkoutListRetrievedSuccessfully
    );
  }

  public async deleteWorkoutSet(req: Request, res: Response): Promise<void> {
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

  public async markSetAsCompleted(req: Request, res: Response): Promise<void> {
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
