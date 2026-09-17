import { IUserSubscriptionPlanRepository } from "@domain/interfaces/IUserSubscriptionPlanRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { IFinancialLogRepository } from "@domain/interfaces/IFinancialLogRepository";
import { IDateService } from "@application/interfaces/services/date/IDate.service";
import { RoleType } from "@application/dtos/auth-dtos";
import { EarningsOverViewUI } from "@infrastructure/mappers/chart.mappers";
import { AdminDashBoardStats } from "@application/dtos/trainer-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IAdminDashBoardUC } from "@application/interfaces/usecases/IDashBoardUC";
import { Top5TrainesUILayer } from "@infrastructure/mappers/subscriptionPlan.mapper";

@injectable()
export class AdminDashBoardUseCase implements IAdminDashBoardUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserSubscriptionPlanRepository)
    private userSubscriptionPlanRepository: IUserSubscriptionPlanRepository,
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository,
    @inject(TYPES_REPOSITORIES.FinancialLogRepository)
    private financalRepository: IFinancialLogRepository,
    @inject(TYPES_SERVICES.DateService)
    private dateService: IDateService
  ) {}

  async execute(period: string): Promise<AdminDashBoardStats> {
    const [
      totalUsersCount,
      totalTrainersCount,
      pendingTrainerApprovalCount,
      totalServiceFee,
      totalCommission,
      totalRevenue,
      earningOverView,
      Top5Trainers,
    ] = await Promise.all([
      this.getTotalUsersCount(),
      this.getTotalTrainersCount(),
      this.getPendingTrainerApprovalsCount(),
      this.getTotalServiceFee(),
      this.getTotalCommission(),
      this.getTotalProfit(),
      this.getEarningsOverView(period),
      this.getTop5TrainersWithHighestSubscribers(),
    ]);

    return {
      pendingTrainerApprovalCount,
      totalTrainersCount,
      totalUsersCount,
      totalServiceFee,
      totalCommission,
      totalRevenue,
      earningOverView,
      Top5Trainers,
    };
  }

  private async getTotalUsersCount(): Promise<number> {
    return await this.userRepository.countDocs(RoleType.User);
  }

  private async getTotalTrainersCount(): Promise<number> {
    return await this.userRepository.countDocs(RoleType.Trainer);
  }

  private async getPendingTrainerApprovalsCount(): Promise<number> {
    return await this.trainerRepository.countPendingTrainerApprovals();
  }

  private async getTotalServiceFee(): Promise<number> {
    return await this.financalRepository.getTotalServiceFee();
  }

  private async getTotalCommission(): Promise<number> {
    return await this.financalRepository.getTotalCommission();
  }

  private async getTotalProfit(): Promise<number> {
    return await this.financalRepository.getTotalProfit();
  }

  private async getEarningsOverView(period: string): Promise<EarningsOverViewUI[]> {
    const { startDate, endDate } = this.dateService.getDateRange(period);
    const chartData = await this.financalRepository.getEarningsOverView({
      startDate,
      endDate,
    });
    return chartData;
  }

  private async getTop5TrainersWithHighestSubscribers(): Promise<Top5TrainesUILayer[]> {
    const top5List = await this.userSubscriptionPlanRepository.getTop5TrainersBySubscribers();
    return top5List;
  }
}
