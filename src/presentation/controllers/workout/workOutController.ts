import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  WorkoutStatus,
} from "../../../shared/constants/index-constants";
import { WorkOutUseCase } from "../../../application/usecases/workout/workoutUseCase";
import { MongoWorkoutRepository } from "../../../infrastructure/databases/repositories/workoutRepository";
import { LoggerService } from "../../../infrastructure/logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";

//MONGO REPOSITORY INSTANCES
const mongoWorkoutRepository = new MongoWorkoutRepository();

//SERVICE INSTANCES
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

//USE CASE INSTANCES
const workoutUseCase = new WorkOutUseCase(mongoWorkoutRepository);

export class WorkoutController {
  static async addWorkout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const addedWorkOut = await workoutUseCase.addWorkout(userId, req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        addedWorkOut,
        WorkoutStatus.workoutAddedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "WorkoutController.addWorkout",
        "Error to add workout"
      );
      next(error);
    }
  }

  static async getWorkoutsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "WorkoutController.getWorkoutsByUserId",
        "Error to get user workouts"
      );
      next(error);
    }
  }

  static async deleteWorkoutSet(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { setId } = req.params;
      const deletedWorkoutSet = await workoutUseCase.deleteWorkoutSet(setId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        deletedWorkoutSet,
        WorkoutStatus.WorkoutSetDeleted
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "WorkoutController.deleteWorkoutSet",
        "Error to delete workout set"
      );
      next(error);
    }
  }

  static async markSetAsCompleted(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { setId } = req.params;
      const completedWorkoutSet = await workoutUseCase.markSetAsCompleted(
        setId
      );
      sendResponse(
        res,
        HttpStatusCodes.OK,
        completedWorkoutSet,
        WorkoutStatus.WorkoutSetCompleted
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "WorkoutController.markSetAsCompleted",
        "Error to mark workout as completed"
      );
      next(error);
    }
  }
}
