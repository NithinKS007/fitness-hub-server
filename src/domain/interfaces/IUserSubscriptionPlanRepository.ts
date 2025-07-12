import {
  TrainerChartData,
  TrainerPieChartData,
} from "@application/dtos/chart-dtos";
import {
  DateRangeQueryDTO,
  GetTrainerSubscribersQueryDTO,
  GetUserSubscriptionsQueryDTO,
} from "@application/dtos/query-dtos";
import {
  CheckSubscriptionStatusDTO,
  TrainerSubscriberRecord,
  UpdateSubscriptionStatusDTO,
  UserSubscriptionRecord,
} from "@application/dtos/subscription-dtos";
import { Top5List } from "@application/dtos/trainer-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { UserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IUserSubscriptionPlan } from "@infrastructure/databases/models/user-subscription-plan";

export interface IUserSubscriptionPlanRepository
  extends IBaseRepository<IUserSubscriptionPlan, UserSubscriptionPlan> {
  getUserSubscriptions(
    userId: string,
    searchFilterQuery: GetUserSubscriptionsQueryDTO
  ): Promise<{
    userSubscriptionRecord: UserSubscriptionRecord[];
    paginationData: PaginationDTO;
  }>;
  getTrainerSubscriptions(
    trainerId: string,
    searchFilterQuery: GetTrainerSubscribersQueryDTO
  ): Promise<{
    trainerSubscriberRecord: TrainerSubscriberRecord[];
    paginationData: PaginationDTO;
  }>;
  getSubscriptionByStripeId(
    stripeSubscriptionId: string
  ): Promise<UserSubscriptionPlan>;
  getSubscriptionsByUserAndTrainerId(
    data: CheckSubscriptionStatusDTO
  ): Promise<UserSubscriptionPlan[] | null>;
  updateSubscriptionStatusByStripeId(
    updateSubscriptionStatus: UpdateSubscriptionStatusDTO
  ): Promise<UserSubscriptionPlan | null>;
  countAllTrainerSubscribers(trainerId: string): Promise<number>;
  countAllActiveSubscribers(trainerId: string): Promise<number>;
  countCanceledSubscribers(trainerId: string): Promise<number>;
  getTrainerLineChartData(
    trainerId: string,
    dateFilterQuery: DateRangeQueryDTO
  ): Promise<TrainerChartData[]>;
  getTrainerPieChartData(
    trainerId: string,
    dateFilterQuery: DateRangeQueryDTO
  ): Promise<TrainerPieChartData[]>;
  getTop5TrainersBySubscribers(): Promise<Top5List[]>;
}
