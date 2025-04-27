import { IdDTO } from "../../dtos/utilityDTOs";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthenticationStatusMessage } from "../../../shared/constants/httpResponseStructure";
import { IUserSubscriptionPlanRepository } from "../../../domain/interfaces/IUserSubscriptionRepository";
import { TrainerDashboardStats } from "../../../domain/entities/trainer";
import { DashBoardChartFilterDTO } from "../../dtos/queryDTOs";
import { getDateRange } from "../../../shared/utils/dayjs";

export class TrainerDashBoardUseCase {
  constructor(
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository
  ) {}
  public async getTrainerDashBoardData(
    trainerId: IdDTO,
    period: DashBoardChartFilterDTO
  ): Promise<TrainerDashboardStats> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
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

  private async getTotalSubscriptionsCount(trainerId: IdDTO): Promise<number> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
    }
    const totalCount =
      await this.userSubscriptionPlanRepository.countAllTrainerSubscribers(
        trainerId
      );
    return totalCount
  }

  private async getActiveSubscriptionsCount(trainerId: IdDTO): Promise<number> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
    }
    const activeCount =
      await this.userSubscriptionPlanRepository.countAllActiveSubscribers(
        trainerId
      );
    return activeCount
  }

  private async getCanceledSubscriptionCount(
    trainerId: IdDTO
  ): Promise<number> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
    }

    const canceledCount =
      await this.userSubscriptionPlanRepository.countCanceledSubscribers(
        trainerId
      );
    return canceledCount
  }

  private async getChartSubscriptionsData(
    trainerId: IdDTO,
    period: DashBoardChartFilterDTO
  ): Promise<any> {
    const { startDate, endDate } = getDateRange(period);

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
    trainerId: IdDTO,
    period: DashBoardChartFilterDTO
  ): Promise<any> {
    const { startDate, endDate } = getDateRange(period);

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
