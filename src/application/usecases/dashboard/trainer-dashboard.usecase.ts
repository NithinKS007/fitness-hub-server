import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  DashboardStatus,
} from "@shared/constants/index.constants";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { IDateService } from "@application/interfaces/date/IDate.service";
import { TrainerDashboardStats } from "@application/dtos/trainer-dtos";
import {
  TrainerChartData,
  TrainerPieChartData,
} from "@application/dtos/chart-dtos";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "di/types-services";
import { TYPES_REPOSITORIES } from "di/types-repositories";

@injectable()
export class TrainerDashBoardUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserSubscriptionPlanRepository)
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    @inject(TYPES_SERVICES.DateService)
    private dateService: IDateService
  ) {}
  
  async execute(
    trainerId: string,
    period: string
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
    period: string
  ): Promise<TrainerChartData[]> {
    const { startDate, endDate } = this.dateService.getDateRange(period);

    const chartData =
      await this.userSubscriptionPlanRepository.getTrainerLineChartData(
        trainerId,
        { startDate, endDate }
      );

    if (!chartData) {
      throw new validationError(DashboardStatus.FailedToRetrieveChart);
    }

    return chartData;
  }

  private async getPieChartSubscriptionsData(
    trainerId: string,
    period: string
  ): Promise<TrainerPieChartData[]> {
    const { startDate, endDate } = this.dateService.getDateRange(period);

    const pieChartData =
      await this.userSubscriptionPlanRepository.getTrainerPieChartData(
        trainerId,
        { startDate, endDate }
      );

    if (!pieChartData) {
      throw new validationError(DashboardStatus.FailedToRetrieveChart);
    }

    return pieChartData;
  }
}
