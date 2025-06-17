import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IWorkoutRepository } from "@domain/interfaces/IWorkoutRepository";
import { Model } from "mongoose";
import {
  CustomUserDashBoardQueryDTO,
  GetWorkoutQueryDTO,
} from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import WorkoutModel from "@infrastructure/databases/models/workout.model";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { WorkoutChartData } from "@application/dtos/workout-dtos";
import { IWorkout } from "@domain/entities/workout.entity";

export class WorkoutRepository
  extends BaseRepository<IWorkout>
  implements IWorkoutRepository
{
  constructor(model: Model<IWorkout> = WorkoutModel) {
    super(model);
  }

  async getWorkoutsByUserId(
    userId: string,
    { page, limit, fromDate, toDate, search, filters }: GetWorkoutQueryDTO
  ): Promise<{ workoutList: IWorkout[]; paginationData: PaginationDTO }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    const matchQuery: any = { userId: this.parseId(userId) };
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
        matchQuery.date.$gte = fromDate;
      }
      if (toDate) {
        matchQuery.date.$lte = toDate;
      }
    }

    const [workoutList, totalCount] = await Promise.all([
      this.model
        .find(matchQuery)
        .sort({ date: 1 })
        .skip(skip)
        .limit(limitNumber)
        .lean()
        .exec(),
      this.model.countDocuments(matchQuery).exec(),
    ]);
    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    return {
      workoutList,
      paginationData,
    };
  }

  async getUserDashBoardChartData({
    userId,
    bodyPart,
    startDate,
    endDate,
  }: CustomUserDashBoardQueryDTO): Promise<WorkoutChartData[]> {
    const matchQuery: any = {
      userId: this.parseId(userId),
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      isCompleted: true,
    };

    if (bodyPart && bodyPart !== "All") {
      matchQuery.bodyPart = bodyPart;
    }

    const result = await this.model.aggregate([
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
    const result = await this.model
      .aggregate([
        {
          $match: {
            userId: this.parseId(userId),
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
    const result = await this.model.aggregate([
      {
        $match: {
          userId: this.parseId(userId),
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
    const result = await this.model.aggregate([
      {
        $match: {
          userId: this.parseId(userId),
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
}
