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
import { IUserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IUserSubscriptionPlanRepository
  extends IBaseRepository<IUserSubscriptionPlan> {
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
  ): Promise<IUserSubscriptionPlan>;
  getSubscriptionsByUserAndTrainerId(
    data: CheckSubscriptionStatusDTO
  ): Promise<IUserSubscriptionPlan[] | null>;
  updateSubscriptionStatusByStripeId(
    updateSubscriptionStatus: UpdateSubscriptionStatusDTO
  ): Promise<IUserSubscriptionPlan | null>;
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
