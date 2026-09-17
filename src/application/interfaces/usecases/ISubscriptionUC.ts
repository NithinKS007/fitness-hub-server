import { IBaseUseCase } from "./IBase.UC";
import {
  GetTrainerSubsDTO,
  GetUserSubDTO,
  GetUserTrainersListDTO,
} from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import {
  CancelSubscriptionDTO,
  CheckSubscriptionStatusDTO,
  PurchaseSubscriptionDTO,
  TrainerSubList,
  UserSubList,
} from "@application/dtos/subscription-dtos";
import { Subscription } from "@domain/entities/subscription.entity";
import { UserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";
import { UserMyTRListUILayer } from "@infrastructure/mappers/chat.mapper";

export interface ICancelSubscriptionUC
  extends IBaseUseCase<
    CancelSubscriptionDTO,
    {
      providerSubId: string;
      isActive: string;
      cancelAction: string;
    }
  > {}

export interface ICheckSubscriptionStatusUC
  extends IBaseUseCase<
    CheckSubscriptionStatusDTO,
    {
      trainerId: string;
      isSubscribed: boolean;
    }
  > {}

export interface IGetTrainerSubscribersUC
  extends IBaseUseCase<
    GetTrainerSubsDTO,
    {
      trainerSubscribers: TrainerSubList[];
      paginationData: PaginationDTO;
    }
  > {}

export interface IGetTrainerSubscriptionsUC
  extends IBaseUseCase<string, Subscription[]> {}

export interface IGetUserSubscriptionsUC
  extends IBaseUseCase<
    GetUserSubDTO,
    {
      userSubscriptionsList: UserSubList[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetUserTrainerslistUC
  extends IBaseUseCase<
    GetUserTrainersListDTO,
    {
      userTrainersList: UserMyTRListUILayer[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IPurchaseSubscriptionUC
  extends IBaseUseCase<PurchaseSubscriptionDTO, string> {}

export interface IVerifySubscriptionSessionUC
  extends IBaseUseCase<string, UserSubscriptionPlan & { isSubscribed: boolean }> {}

export interface IWebHookHandlerUC
  extends IBaseUseCase<
    {
      sig: string;
      webhookSecret: string;
      body: string | Buffer;
    },
    void
  > {}
