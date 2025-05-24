import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  WorkoutStatus,
} from "../../../shared/constants/index-constants";
import { MongoWorkoutRepository } from "../../../infrastructure/databases/repositories/workoutRepository";
import { CreateWorkoutUseCase } from "../../../application/usecases/workout/createWorkoutUseCase";
import { GetWorkoutUseCase } from "../../../application/usecases/workout/getWorkoutUseCase";
import { UpdateWorkoutUseCase } from "../../../application/usecases/workout/updateWorkoutUseCase";

//MONGO REPOSITORY INSTANCES
const mongoWorkoutRepository = new MongoWorkoutRepository();

//USE CASE INSTANCES
const createWorkoutUseCase = new CreateWorkoutUseCase(mongoWorkoutRepository)
const getWorkoutUseCase = new GetWorkoutUseCase(mongoWorkoutRepository)
const updateWorkoutUseCase = new UpdateWorkoutUseCase(mongoWorkoutRepository)

export class WorkoutController {
  static async addWorkout(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;
    const addedWorkOut = await createWorkoutUseCase.addWorkout(userId, req.body);
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
      await getWorkoutUseCase.getWorkoutsByUserId(userId, {
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
    const deletedWorkoutSet = await updateWorkoutUseCase.deleteWorkoutSet(setId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      deletedWorkoutSet,
      WorkoutStatus.WorkoutSetDeleted
    );
  }

  static async markSetAsCompleted(req: Request, res: Response): Promise<void> {
    const { setId } = req.params;
    const completedWorkoutSet = await updateWorkoutUseCase.markSetAsCompleted(setId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      completedWorkoutSet,
      WorkoutStatus.WorkoutSetCompleted
    );
  }
}
