import {
  DateRangeQueryDTO,
  GetTrainerSubscribersQueryDTO,
  GetUserSubscriptionsQueryDTO,
  GetUserTrainersListQueryDTO,
} from "../../application/dtos/query-dtos";
import {
  CheckSubscriptionStatusDTO,
  CreateUserSubscriptionPlanDTO,
  UpdateSubscriptionStatusDTO,
} from "../../application/dtos/subscription-dtos";
import { IdDTO, PaginationDTO } from "../../application/dtos/utility-dtos";
import { TrainerChartData, TrainerPieChartData } from "../entities/chart";
import {
  UserSubscriptionRecord,
  TrainerSubscriberRecord,
  UserMyTrainersList,
} from "../entities/subscription";
import { Top5List } from "../entities/trainer";
import { SubscriptionPlanEntity } from "../entities/userSubscriptionPlan";

export interface IUserSubscriptionPlanRepository {
  create(
    createUserSubscription: CreateUserSubscriptionPlanDTO
  ): Promise<SubscriptionPlanEntity>;
  findSubscriptionsOfUser(
    userId: IdDTO,
    searchFilterQuery: GetUserSubscriptionsQueryDTO
  ): Promise<{
    userSubscriptionRecord: UserSubscriptionRecord[];
    paginationData: PaginationDTO;
  }>;
  findSubscriptionsOfTrainer(
    trainerId: IdDTO,
    searchFilterQuery: GetTrainerSubscribersQueryDTO
  ): Promise<{
    trainerSubscriberRecord: TrainerSubscriberRecord[];
    paginationData: PaginationDTO;
  }>;
  findSubscriptionByStripeSubscriptionId(
    stripeSubscriptionId: IdDTO
  ): Promise<SubscriptionPlanEntity>;
  findSubscriptionsOfUserwithUserIdAndTrainerId(
    data: CheckSubscriptionStatusDTO
  ): Promise<SubscriptionPlanEntity[] | null>;
  findSubscriptionByStripeSubscriptionIdAndUpdateStatus(
    updateSubscriptionStatus: UpdateSubscriptionStatusDTO
  ): Promise<SubscriptionPlanEntity | null>;
  countAllTrainerSubscribers(trainerId: IdDTO): Promise<number>;
  countAllActiveSubscribers(trainerId: IdDTO): Promise<number>;
  countCanceledSubscribers(trainerId: IdDTO): Promise<number>;
  trainerChartDataFilter(
    trainerId: IdDTO,
    dateFilterQuery: DateRangeQueryDTO
  ): Promise<TrainerChartData[]>;
  trainerPieChartDataFilter(
    trainerId: IdDTO,
    dateFilterQuery: DateRangeQueryDTO
  ): Promise<TrainerPieChartData[]>;
  findTop5TrainersWithHighestSubscribers(): Promise<Top5List[]>;
  usersMyTrainersList(
    userId: IdDTO,
    searchFilterQuery: GetUserTrainersListQueryDTO
  ): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }>;
}
