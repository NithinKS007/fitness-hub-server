import {
  DateRangeDTO,
  GetTrainerSubsDTO,
  GetUserSubDTO,
} from "@application/dtos/query-dtos";
import { CheckSubscriptionStatusDTO } from "@application/dtos/subscription-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { UserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IUserSubscriptionPlan } from "@infrastructure/databases/models/user-subscription-plan";
import {
  TRSubPeriodWiseCountUI,
  TRSubStatusWiseCountUI,
} from "@infrastructure/mappers/chart.mappers";
import {
  Top5TrainesUILayer,
  TrainerSubUILayer,
  UserSubUILayer,
} from "@infrastructure/mappers/subscriptionPlan.mapper";

export interface IUserSubscriptionPlanRepository
  extends IBaseRepository<IUserSubscriptionPlan, UserSubscriptionPlan> {
  getUserSubscriptions(dtos: GetUserSubDTO): Promise<PagedResponse<UserSubUILayer>>;
  getTrainerSubscriptions(
    dtos: GetTrainerSubsDTO
  ): Promise<PagedResponse<TrainerSubUILayer>>;
  getLatestPlan(
    dtos: CheckSubscriptionStatusDTO
  ): Promise<UserSubscriptionPlan | null>;
  countAllTrainerSubscribers(trainerId: string): Promise<number>;
  countAllActiveSubscribers(trainerId: string): Promise<number>;
  countCanceledSubscribers(trainerId: string): Promise<number>;
  getTrainerSubStatusWiseCount(
    trainerId: string,
    dtos: DateRangeDTO
  ): Promise<TRSubStatusWiseCountUI[]>;
  getTrainerSubPeriodWiseCount(
    trainerId: string,
    dtos: DateRangeDTO
  ): Promise<TRSubPeriodWiseCountUI[]>;
  getTop5TrainersBySubscribers(): Promise<Top5TrainesUILayer[]>;
}
