import { PagedResponse } from "@application/dtos/utility-dtos";
import { IWorkoutRepository } from "@domain/interfaces/IWorkoutRepository";
import { FilterQuery, Model } from "mongoose";
import {
  GetWeightLiftedByDateDTO,
  GetWorkoutsDTO,
} from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import WorkoutModel, {
  IWorkout,
} from "@infrastructure/databases/models/workout.model";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { Workout } from "@domain/entities/workout.entity";
import { MongoHelper } from "../utils/mongo-helper";
import {
  WeightLiftedByDateMapper,
  WeightLiftedByDateUILayer,
} from "@infrastructure/mappers/workout.mapper";

export class WorkoutRepository
  extends BaseRepository<IWorkout, Workout>
  implements IWorkoutRepository
{
  constructor(
    model: Model<IWorkout> = WorkoutModel,
    private weightLiftedByDateMapper: WeightLiftedByDateMapper = new WeightLiftedByDateMapper(),
    private utility: MongoHelper = new MongoHelper()
  ) {
    super(model);
  }

  private async aggregateWorkoutStats({
    userId,
    matchQuery,
    field,
  }: {
    userId: string;
    matchQuery: object;
    field: string;
  }): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { userId: this.parseId(userId), ...matchQuery } },
      {
        $group: {
          _id: null,
          total: { $sum: `$${field}` },
        },
      },
    ]);
    return result[0]?.total || 0;
  }

  async getWorkouts(dtos: GetWorkoutsDTO): Promise<PagedResponse<Workout>> {
    const { userId, page, limit, fromDate, toDate, search, filters } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: FilterQuery<IWorkout> = {
      userId: this.parseId(userId),
      ...this.utility.search({ search }, ["bodyPart", "exerciseName"]),
      ...this.utility.dateFilter({ fromDate, toDate }, "date"),
    };

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions: { isCompleted: boolean }[] = [];

      for (const filter of filters) {
        switch (filter) {
          case "Completed":
            conditions.push({ isCompleted: true });
            break;
          case "Pending":
            conditions.push({ isCompleted: false });
            break;
          default:
            break;
        }
      }

      if (conditions.length > 0) {
        matchQuery.$and = conditions;
      }
    }

    const [workoutList, totalCount] = await Promise.all([
      this.model
        .find(matchQuery)
        .sort({ date: 1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
      this.model.countDocuments(matchQuery).exec(),
    ]);

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    const mappedData = workoutList.map((data) => this.toDomain(data));

    return {
      data: mappedData,
      pagination: paginationData,
    };
  }

  async getWeightLiftedByDate(
    dtos: GetWeightLiftedByDateDTO
  ): Promise<WeightLiftedByDateUILayer[]> {
    const { userId, bodyPart, startDate, endDate } = dtos;
    const matchQuery = {
      userId: this.parseId(userId),
      ...this.utility.dateFilter({ fromDate: startDate, toDate: endDate }, "date"),
      isCompleted: true,
      ...(bodyPart && bodyPart !== "All" ? { bodyPart } : {}),
    };

    const result = await this.model.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$date",
          totalWeight: { $sum: { $ifNull: ["$kg", 0] } },
        },
      },
      {
        $project: {
          _id: 1,
          totalWeight: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);
    return result.map((data) => this.weightLiftedByDateMapper.map(data));
  }

  async getTotalWorkoutTime(userId: string): Promise<number> {
    const matchQuery = { isCompleted: true };
    return this.aggregateWorkoutStats({ userId, matchQuery, field: "time" });
  }

  async getTotalPendingWorkouts(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const matchQuery = {
      date: { $gte: startDate, $lte: endDate },
      isCompleted: false,
    };
    return this.aggregateWorkoutStats({ userId, matchQuery, field: "1" });
  }

  async getTotalCompletedWorkouts(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const matchQuery = {
      date: { $gte: startDate, $lte: endDate },
      isCompleted: true,
    };
    return this.aggregateWorkoutStats({ userId, matchQuery, field: "1" });
  }
}
