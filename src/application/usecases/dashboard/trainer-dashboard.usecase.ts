import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ApplicationStatus } from "../../../shared/constants/index.constants";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import { TrainerDashboardStats } from "../../../domain/entities/trainer.entities";
import { DashBoardChartFilterDTO } from "../../dtos/query-dtos";
import { IDateService } from "../../interfaces/date/IDate.service";

export class TrainerDashBoardUseCase {
  constructor(
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    private dateService: IDateService
  ) {}
  async getTrainerDashBoardData(
    trainerId: string,
    period: DashBoardChartFilterDTO
  ): Promise<TrainerDashboardStats> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    const [
      totalSubscribersCount,
      activeSubscribersCount,
      canceledSubscribersCount,
      chartData,
      pieChartData,
    ] = await Promise.all([
      this.getTotalSubscriptionsCount(trainerId),
      this.getActiveSubscriptionsCount(trainerId),
      this.getCanceledSubscriptionCount(trainerId),
      this.getChartSubscriptionsData(trainerId, period),
      this.getPieChartSubscriptionsData(trainerId, period),
    ]);
    return {
      chartData,
      pieChartData,
      totalSubscribersCount,
      activeSubscribersCount,
      canceledSubscribersCount,
    };
  }

  private async getTotalSubscriptionsCount(trainerId: string): Promise<number> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const totalCount =
      await this.userSubscriptionPlanRepository.countAllTrainerSubscribers(
        trainerId
      );
    return totalCount;
  }

  private async getActiveSubscriptionsCount(
    trainerId: string
  ): Promise<number> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const activeCount =
      await this.userSubscriptionPlanRepository.countAllActiveSubscribers(
        trainerId
      );
    return activeCount;
  }

  private async getCanceledSubscriptionCount(
    trainerId: string
  ): Promise<number> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    const canceledCount =
      await this.userSubscriptionPlanRepository.countCanceledSubscribers(
        trainerId
      );
    return canceledCount;
  }

  private async getChartSubscriptionsData(
    trainerId: string,
    period: DashBoardChartFilterDTO
  ): Promise<any> {
    const { startDate, endDate } = this.dateService.getDateRange(period);

    const chartData =
      await this.userSubscriptionPlanRepository.trainerChartDataFilter(
        trainerId,
        { startDate, endDate }
      );

    if (!chartData) {
      throw new validationError("Failed to retrieve chartdata");
    }

    return chartData;
  }

  private async getPieChartSubscriptionsData(
    trainerId: string,
    period: DashBoardChartFilterDTO
  ): Promise<any> {
    const { startDate, endDate } = this.dateService.getDateRange(period);

    const pieChartData =
      await this.userSubscriptionPlanRepository.trainerPieChartDataFilter(
        trainerId,
        { startDate, endDate }
      );

    if (!pieChartData) {
      throw new validationError("Failed to retrieve chartdata");
    }

    return pieChartData;
  }
}
