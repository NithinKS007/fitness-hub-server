import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  WorkoutStatusMessage,
} from "../../shared/constants/httpResponseStructure";
import { WorkOutUseCase } from "../../application/usecases/workoutUseCase";
import { MongoWorkoutRepository } from "../../infrastructure/databases/repositories/workoutRepository";
import logger from "../../infrastructure/logger/logger";
import { handleLogError } from "../../shared/utils/handleLog";

const mongoWorkoutRepository = new MongoWorkoutRepository();
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
        WorkoutStatusMessage.workoutAddedSuccessfully
      );
    } catch (error) {
      handleLogError(
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
        WorkoutStatusMessage.WorkoutListRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
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
        WorkoutStatusMessage.WorkoutSetDeleted
      );
    } catch (error) {
      handleLogError(
        error,
        "WorkoutController.deleteWorkoutSet",
        "Error to delete workout set"
      )
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
        WorkoutStatusMessage.WorkoutSetCompleted
      );
    } catch (error) {
      handleLogError(
        error,
        "WorkoutController.markSetAsCompleted",
        "Error to mark workout as completed"
      )
      next(error);
    }
  }
}
