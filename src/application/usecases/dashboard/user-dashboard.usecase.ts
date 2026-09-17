import { IWorkoutRepository } from "@domain/interfaces/IWorkoutRepository";
import { UserDashBoardDTO } from "@application/dtos/query-dtos";
import { IDateService } from "@application/interfaces/services/date/IDate.service";
import {
  UserDashBoard,
} from "@application/dtos/workout-dtos";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IUserDashBoardUC } from "@application/interfaces/usecases/IDashBoardUC";
import { WeightLiftedByDateUILayer } from "@infrastructure/mappers/workout.mapper";

@injectable()
export class UserDashBoardUseCase implements IUserDashBoardUC {
  constructor(
    @inject(TYPES_REPOSITORIES.WorkoutRepository)
    private workoutRepository: IWorkoutRepository,
    @inject(TYPES_SERVICES.DateService)
    private dateService: IDateService
  ) {}

  async execute({
    period,
    bodyPart,
    userId,
  }: UserDashBoardDTO): Promise<UserDashBoard> {
    const [
      totalWorkoutTime,
      totalPendingWorkouts,
      totalCompletedWorkouts,
      weightLiftedByDate,
    ] = await Promise.all([
      this.getTotalWorkoutTime(userId),
      this.getTotalPendingWorkouts(userId),
      this.getTotalCompletedWorkouts(userId),
      this.getWeightLiftedByDate({ period, bodyPart, userId }),
    ]);

    return {
      weightLiftedByDate,
      totalWorkoutTime,
      totalPendingWorkouts,
      totalCompletedWorkouts,
    };
  }

  private async getTotalWorkoutTime(userId: string): Promise<number> {
    return await this.workoutRepository.getTotalWorkoutTime(userId);
  }
  private async getTotalPendingWorkouts(userId: string): Promise<number> {
    const { startDate, endDate } = this.dateService.getDateRange("Today");
    return await this.workoutRepository.getTotalPendingWorkouts(
      userId,
      startDate,
      endDate
    );
  }
  private async getTotalCompletedWorkouts(userId: string): Promise<number> {
    const { startDate, endDate } = this.dateService.getDateRange("Today");
    return await this.workoutRepository.getTotalCompletedWorkouts(
      userId,
      startDate,
      endDate
    );
  }

  private async getWeightLiftedByDate({
    period,
    bodyPart,
    userId,
  }: {
    period: string;
    bodyPart: string;
    userId: string;
  }): Promise<WeightLiftedByDateUILayer[]> {
    const { startDate, endDate } = this.dateService.getDateRange(period);
    const chartData = await this.workoutRepository.getWeightLiftedByDate({
      startDate: startDate,
      endDate: endDate,
      userId: userId,
      bodyPart: bodyPart,
    });
    return chartData;
  }
}
