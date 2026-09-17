import { IBaseUseCase } from "./IBase.UC";
import {
  SubPeriod,
  UpdateSubscriptionBlockStatusDTO,
  UpdateSubscriptionDetailsDTO,
} from "@application/dtos/subscription-dtos";
import { Subscription } from "@domain/entities/subscription.entity";

export interface ICreateSubscriptionUC
  extends IBaseUseCase<
    {
      trainerId: string;
      subPeriod: SubPeriod;
      price: number;
      durationInWeeks: number;
      sessionsPerWeek: number;
      totalSessions: number;
    },
    Subscription
  > {}
export interface IDeleteSubscriptionUC
  extends IBaseUseCase<string, Subscription> {}
export interface IEditSubscriptionUC
  extends IBaseUseCase<UpdateSubscriptionDetailsDTO, Subscription> {}
export interface ISubscriptionBlockUC
  extends IBaseUseCase<UpdateSubscriptionBlockStatusDTO, Subscription> {}
