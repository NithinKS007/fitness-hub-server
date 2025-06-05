import { UserDashBoard } from "../../../domain/entities/user.entities";
import { WorkoutChartData } from "../../../domain/entities/workout.entities";
import { IWorkoutRepository } from "../../../domain/interfaces/IWorkoutRepository";
import { UserDashBoardQueryDTO } from "../../dtos/query-dtos";
import { IDateService } from "../../interfaces/date/IDate.service";

export class UserDashBoardUseCase {
  constructor(
    private workoutRepository: IWorkoutRepository,
    private dateService: IDateService
  ) {}
  
  async execute({
    period,
    bodyPart,
    userId,
  }: UserDashBoardQueryDTO): Promise<UserDashBoard> {
    const [
      totalWorkoutTime,
      todaysTotalPendingWorkouts,
      todaysTotalCompletedWorkouts,
      chartData,
    ] = await Promise.all([
      this.getTotalWorkoutTime(userId),
      this.getTodaysTotalPendingWorkouts(userId),
      this.getTodaysTotalCompletedWorkouts(userId),
      this.getUserChartData({ period, bodyPart, userId }),
    ]);

    return {
      chartData,
      totalWorkoutTime,
      todaysTotalPendingWorkouts,
      todaysTotalCompletedWorkouts,
    };
  }

  private async getTotalWorkoutTime(userId: string): Promise<number> {
    return await this.workoutRepository.getTotalWorkoutTime(userId);
  }
  private async getTodaysTotalPendingWorkouts(userId: string): Promise<number> {
    const { startDate, endDate } = this.dateService.getDateRange("Today");
    return await this.workoutRepository.getTodaysTotalPendingWorkouts(
      userId,
      startDate,
      endDate
    );
  }
  private async getTodaysTotalCompletedWorkouts(
    userId: string
  ): Promise<number> {
    const { startDate, endDate } = this.dateService.getDateRange("Today");
    return await this.workoutRepository.getTodaysTotalCompletedWorkouts(
      userId,
      startDate,
      endDate
    );
  }

  private async getUserChartData({
    period,
    bodyPart,
    userId,
  }: {
    period: string;
    bodyPart: string;
    userId: string;
  }): Promise<WorkoutChartData[]> {
    const { startDate, endDate } = this.dateService.getDateRange(period);
    const chartData = await this.workoutRepository.getUserDashBoardChartData({
      startDate: startDate,
      endDate: endDate,
      userId: userId,
      bodyPart: bodyPart,
    });
    return chartData;
  }
}
