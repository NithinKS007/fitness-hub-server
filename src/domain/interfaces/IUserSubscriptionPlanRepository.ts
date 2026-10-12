import {
  DateRangeDTO,
  GetTrainerSubsDTO,
  GetUserSubDTO,
} from "@application/dtos/query-dtos";
import { CheckSubscriptionStatusDTO } from "@application/dtos/subscription-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { UserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import {
  TRSubPeriodWiseCountUI,
  TRSubStatusWiseCountUI,
} from "@application/dtos/read-models";
import {
  Top5TrainesUILayer,
  TrainerSubUILayer,
  UserSubUILayer,
} from "@application/dtos/read-models";

export interface IUserSubscriptionPlanRepository
  extends IBaseRepository<UserSubscriptionPlan> {
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
