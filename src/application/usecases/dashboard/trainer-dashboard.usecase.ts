import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  DashboardStatus,
} from "@shared/constants/index.constants";
import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { IDateService } from "@application/interfaces/services/date/IDate.service";
import { TrainerDashboardStats } from "@application/dtos/trainer-dtos";
import {
  TRSubPeriodWiseCountUI,
  TRSubStatusWiseCountUI,
} from "@infrastructure/mappers/chart.mappers";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { ITrainerDashBoardUC } from "@application/interfaces/usecases/IDashBoardUC";

@injectable()
export class TrainerDashBoardUseCase implements ITrainerDashBoardUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserSubscriptionPlanRepository)
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    @inject(TYPES_SERVICES.DateService)
    private dateService: IDateService
  ) {}

  async execute({
    trainerId,
    period,
  }: {
    trainerId: string;
    period: string;
  }): Promise<TrainerDashboardStats> {
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
      this.getTrainerSubStatusWiseCount(trainerId, period),
      this.getTrainerSubPeriodWiseCount(trainerId, period),
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

  private async getTrainerSubStatusWiseCount(
    trainerId: string,
    period: string
  ): Promise<TRSubStatusWiseCountUI[]> {
    const { startDate, endDate } = this.dateService.getDateRange(period);

    const chartData =
      await this.userSubscriptionPlanRepository.getTrainerSubStatusWiseCount(
        trainerId,
        { startDate, endDate }
      );

    if (!chartData) {
      throw new validationError(DashboardStatus.FailedToRetrieveChart);
    }

    return chartData;
  }

  private async getTrainerSubPeriodWiseCount(
    trainerId: string,
    period: string
  ): Promise<TRSubPeriodWiseCountUI[]> {
    const { startDate, endDate } = this.dateService.getDateRange(period);

    const pieChartData =
      await this.userSubscriptionPlanRepository.getTrainerSubPeriodWiseCount(
        trainerId,
        { startDate, endDate }
      );

    if (!pieChartData) {
      throw new validationError(DashboardStatus.FailedToRetrieveChart);
    }

    return pieChartData;
  }
}
