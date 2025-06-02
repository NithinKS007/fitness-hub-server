import { PaginationDTO } from "../../../application/dtos/utility-dtos";
import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { WorkoutdbDTO } from "../../../application/dtos/workout-dtos";
import workoutModel from "../models/workout.model";
import {
  Workout,
  WorkoutChartData,
} from "../../../domain/entities/workout.entities";
import mongoose from "mongoose";
import {
  CustomUserDashBoardQueryDTO,
  GetWorkoutQueryDTO,
} from "../../../application/dtos/query-dtos";

export class WorkoutRepository implements IWorkoutRepository {
  async addWorkout(createWorkout: WorkoutdbDTO[]): Promise<Workout[]> {
    const result = await workoutModel.insertMany(createWorkout);
    return result;
  }

  async getWorkoutsByUserId(
    userId: string,
    { page, limit, fromDate, toDate, search, filters }: GetWorkoutQueryDTO
  ): Promise<{ workoutList: Workout[]; paginationData: PaginationDTO }> {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const matchQuery: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (search) {
      matchQuery.$or = [
        { bodyPart: { $regex: `^${search}`, $options: "i" } },
        { exerciseName: { $regex: `^${search}`, $options: "i" } },
      ];
    }

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions: any = [];
      if (filters.includes("Completed")) conditions.push({ isCompleted: true });
      if (filters.includes("Pending")) conditions.push({ isCompleted: false });
      if (conditions.length > 0) matchQuery.$and = conditions;
    }

    if (fromDate || toDate) {
      matchQuery.date = {};
      if (fromDate) {
        matchQuery.date.$gte = new Date(fromDate);
      }
      if (toDate) {
        matchQuery.date.$lte = new Date(toDate);
      }
    }

    const workoutList = await workoutModel
      .find(matchQuery)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limitNumber)
      .lean()
      .exec();

    const totalCount = await workoutModel.countDocuments(matchQuery).exec();
    const totalPages = Math.ceil(totalCount / limitNumber);

    return {
      workoutList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  async deleteWorkoutSet(setId: string): Promise<Workout | null> {
    const deletedSet = await workoutModel.findOneAndDelete({ _id: setId });
    return deletedSet;
  }

  async markAsCompleted(setId: string): Promise<Workout | null> {
    const objectId = new mongoose.Types.ObjectId(setId);
    const updatedSet = await workoutModel
      .findOneAndUpdate(
        { _id: objectId },
        { $set: { isCompleted: true } },
        { new: true, lean: true }
      )
      .exec();

    return updatedSet;
  }

  async getUserDashBoardChartData({
    userId,
    bodyPart,
    startDate,
    endDate,
  }: CustomUserDashBoardQueryDTO): Promise<WorkoutChartData[]> {
    const matchQuery: any = {
      userId: new mongoose.Types.ObjectId(userId),
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      isCompleted: true,
    };

    if (bodyPart && bodyPart !== "All") {
      matchQuery.bodyPart = bodyPart;
    }

    const result = await workoutModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: "%m/%d/%Y", date: "$date" } },
          totalWeight: { $sum: { $ifNull: ["$kg", 0] } },
        },
      },
      {
        $project: {
          _id: 1,
          totalWeight: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return result;
  }

  async getTotalWorkoutTime(userId: string): Promise<number> {
    const result = await workoutModel
      .aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            isCompleted: true,
          },
        },
        {
          $group: {
            _id: null,
            totalWorkedoutTime: { $sum: "$time" },
          },
        },
      ])
      .exec();
    return result[0]?.totalWorkedoutTime ? result[0]?.totalWorkedoutTime : 0;
  }

  async getTodaysTotalPendingWorkouts(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await workoutModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
          isCompleted: false,
        },
      },
      {
        $group: {
          _id: null,
          todayPendingWorkouts: { $sum: 1 },
        },
      },
    ]);
    return result[0]?.todayPendingWorkouts
      ? result[0]?.todayPendingWorkouts
      : 0;
  }

  async getTodaysTotalCompletedWorkouts(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await workoutModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
          isCompleted: true,
        },
      },
      {
        $group: {
          _id: null,
          todayCompletedWorkouts: { $sum: 1 },
        },
      },
    ]);
    return result[0]?.todayCompletedWorkouts
      ? result[0]?.todayCompletedWorkouts
      : 0;
  }

  async getWorkoutBySetId(setId: string): Promise<Workout | null> {
    return await workoutModel.findById(new mongoose.Types.ObjectId(setId));
  }
}
