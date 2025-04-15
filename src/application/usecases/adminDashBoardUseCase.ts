import { IUserSubscriptionPlanRepository } from "../../domain/interfaces/IUserSubscriptionRepository";
import {
  AdminDashBoardStats,
  Top5List,
} from "../../domain/entities/trainerEntity";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ITrainerRepository } from "../../domain/interfaces/ITrainerRepository";
import { IRevenueRepository } from "../../domain/interfaces/IRevenueRepository";
import { getDateRange } from "../../shared/utils/dayjs";
import { AdminChartData } from "../../domain/entities/chartEntity";

export class AdminDashBoardUseCase {
  constructor(
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private userRepository: IUserRepository,
    private trainerRepository: ITrainerRepository,
    private revenueRepository: IRevenueRepository
  ) {}

  public async getAdminDashBoardData(
    period: string
  ): Promise<AdminDashBoardStats> {
    const [
      totalUsersCount,
      totalTrainersCount,
      pendingTrainerApprovalCount,
      totalPlatFormFee,
      totalCommission,
      totalRevenue,
      chartData,
      top5List,
    ] = await Promise.all([
      this.getTotalUsersCount(),
      this.getTotalTrainersCount(),
      this.getPendingTrainerApprovalsCount(),
      this.getTotalPlatFormFee(),
      this.getTotalCommission(),
      this.getTotalRevenue(),
      this.getRevenueChartData(period),
      this.getTop5TrainersWithHighestSubscribers(),
    ]);

    return {
      pendingTrainerApprovalCount,
      totalTrainersCount,
      totalUsersCount,
      totalPlatFormFee,
      totalCommission,
      totalRevenue,
      chartData,
      top5List,
    };
  }

  private async getTotalUsersCount(): Promise<number> {
    return await this.userRepository.countDocs("user");
  }

  private async getTotalTrainersCount(): Promise<number> {
    return await this.userRepository.countDocs("trainer");
  }

  private async getPendingTrainerApprovalsCount(): Promise<number> {
    return await this.trainerRepository.countPendingTrainerApprovals();
  }

  private async getTotalPlatFormFee(): Promise<number> {
    return await this.revenueRepository.getTotalPlatFormFee();
  }

  private async getTotalCommission(): Promise<number> {
    return await this.revenueRepository.getTotalCommission();
  }

  private async getTotalRevenue(): Promise<number> {
    return await this.revenueRepository.getTotalRevenue();
  }

  private async getRevenueChartData(period: string): Promise<AdminChartData[]> {
    const { startDate, endDate } = getDateRange(period);
    const chartData = await this.revenueRepository.getRevenueChartData({
      startDate,
      endDate,
    });
    return chartData;
  }

  private async getTop5TrainersWithHighestSubscribers(): Promise<Top5List[]> {
    const top10List =
      await this.userSubscriptionPlanRepository.findTop5TrainersWithHighestSubscribers();
    return top10List;
  }
}
