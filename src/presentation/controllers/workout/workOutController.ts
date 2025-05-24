import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  WorkoutStatus,
} from "../../../shared/constants/index-constants";
import { WorkOutUseCase } from "../../../application/usecases/workout/workoutUseCase";
import { MongoWorkoutRepository } from "../../../infrastructure/databases/repositories/workoutRepository";

//MONGO REPOSITORY INSTANCES
const mongoWorkoutRepository = new MongoWorkoutRepository();

//USE CASE INSTANCES
const workoutUseCase = new WorkOutUseCase(mongoWorkoutRepository);

export class WorkoutController {
  static async addWorkout(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;
    const addedWorkOut = await workoutUseCase.addWorkout(userId, req.body);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      addedWorkOut,
      WorkoutStatus.workoutAddedSuccessfully
    );
  }

  static async getWorkoutsByUserId(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { workoutList, paginationData } =
      await workoutUseCase.getWorkoutsByUserId(userId, {
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

  static async deleteWorkoutSet(req: Request, res: Response): Promise<void> {
    const { setId } = req.params;
    const deletedWorkoutSet = await workoutUseCase.deleteWorkoutSet(setId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      deletedWorkoutSet,
      WorkoutStatus.WorkoutSetDeleted
    );
  }

  static async markSetAsCompleted(req: Request, res: Response): Promise<void> {
    const { setId } = req.params;
    const completedWorkoutSet = await workoutUseCase.markSetAsCompleted(setId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      completedWorkoutSet,
      WorkoutStatus.WorkoutSetCompleted
    );
  }
}
