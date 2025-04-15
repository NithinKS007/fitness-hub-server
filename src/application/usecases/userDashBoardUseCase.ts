import { UserDashBoard } from "../../domain/entities/userEntity";
import { WorkoutChartData } from "../../domain/entities/workoutEntity";
import { IWorkoutRepository } from "../../domain/interfaces/IWorkoutRepository";
import { getDateRange } from "../../shared/utils/dayjs";
import { UserDashBoardQueryDTO } from "../dtos/queryDTOs";

export class UserDashBoardUseCase {
  constructor(private workoutRepository: IWorkoutRepository) {}
  public async getUserDashBoardData({
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
    const { startDate, endDate } = getDateRange("Today");
    return await this.workoutRepository.getTodaysTotalPendingWorkouts(
      userId,
      startDate,
      endDate
    );
  }
  private async getTodaysTotalCompletedWorkouts(
    userId: string
  ): Promise<number> {
    const { startDate, endDate } = getDateRange("Today");
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
    const { startDate, endDate } = getDateRange(period);
    const chartData = await this.workoutRepository.getUserDashBoardChartData({
      startDate: startDate,
      endDate: endDate,
      userId: userId,
      bodyPart: bodyPart,
    });
    return chartData;
  }
}
