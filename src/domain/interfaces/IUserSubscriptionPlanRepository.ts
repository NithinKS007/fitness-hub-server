import {
  DateRangeQueryDTO,
  GetTrainerSubscribersQueryDTO,
  GetUserSubscriptionsQueryDTO,
  GetUserTrainersListQueryDTO,
} from "../../application/dtos/query-dtos";
import {
  CheckSubscriptionStatusDTO,
  UpdateSubscriptionStatusDTO,
} from "../../application/dtos/subscription-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import {
  TrainerChartData,
  TrainerPieChartData,
} from "../entities/chart.entities";
import {
  UserSubscriptionRecord,
  TrainerSubscriberRecord,
  UserMyTrainersList,
} from "../entities/subscription.entities";
import { Top5List } from "../entities/trainer.entities";
import { SubscriptionPlanEntity } from "../entities/subscription-plan.entities";
import { IBaseRepository } from "./IBaseRepository";
import { IUserSubscriptionPlan } from "../../infrastructure/databases/models/user-subscription-plan";

export interface IUserSubscriptionPlanRepository
  extends IBaseRepository<IUserSubscriptionPlan> {
  findSubscriptionsOfUser(
    userId: string,
    searchFilterQuery: GetUserSubscriptionsQueryDTO
  ): Promise<{
    userSubscriptionRecord: UserSubscriptionRecord[];
    paginationData: PaginationDTO;
  }>;
  findSubscriptionsOfTrainer(
    trainerId: string,
    searchFilterQuery: GetTrainerSubscribersQueryDTO
  ): Promise<{
    trainerSubscriberRecord: TrainerSubscriberRecord[];
    paginationData: PaginationDTO;
  }>;
  findSubscriptionByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<SubscriptionPlanEntity>;
  findSubscriptionsOfUserwithUserIdAndTrainerId(
    data: CheckSubscriptionStatusDTO
  ): Promise<SubscriptionPlanEntity[] | null>;
  findSubscriptionByStripeSubscriptionIdAndUpdateStatus(
    updateSubscriptionStatus: UpdateSubscriptionStatusDTO
  ): Promise<SubscriptionPlanEntity | null>;
  countAllTrainerSubscribers(trainerId: string): Promise<number>;
  countAllActiveSubscribers(trainerId: string): Promise<number>;
  countCanceledSubscribers(trainerId: string): Promise<number>;
  trainerChartDataFilter(
    trainerId: string,
    dateFilterQuery: DateRangeQueryDTO
  ): Promise<TrainerChartData[]>;
  trainerPieChartDataFilter(
    trainerId: string,
    dateFilterQuery: DateRangeQueryDTO
  ): Promise<TrainerPieChartData[]>;
  findTop5TrainersWithHighestSubscribers(): Promise<Top5List[]>;
  usersMyTrainersList(
    userId: string,
    searchFilterQuery: GetUserTrainersListQueryDTO
  ): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }>;
}
