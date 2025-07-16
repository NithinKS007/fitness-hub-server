import { IBaseUseCase } from "./IBase.UC";
import {
  GetTrainerSubscribersQueryDTO,
  GetUserSubscriptionsQueryDTO,
  GetUserTrainersListQueryDTO,
} from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import {
  CancelSubscriptionDTO,
  CheckSubscriptionStatusDTO,
  PurchaseSubscriptionDTO,
  TrainerSubscribersList,
  UserMyTrainersList,
  UserSubscriptionsList,
} from "@application/dtos/subscription-dtos";
import { Subscription } from "@domain/entities/subscription.entity";
import { UserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";

export interface ICancelSubscriptionUC
  extends IBaseUseCase<
    CancelSubscriptionDTO,
    {
      stripeSubscriptionId: string;
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
    GetTrainerSubscribersQueryDTO,
    {
      trainerSubscribers: TrainerSubscribersList[];
      paginationData: PaginationDTO;
    }
  > {}

export interface IGetTrainerSubscriptionsUC
  extends IBaseUseCase<string, Subscription[]> {}

export interface IGetUserSubscriptionsUC
  extends IBaseUseCase<
    GetUserSubscriptionsQueryDTO,
    {
      userSubscriptionsList: UserSubscriptionsList[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetUserTrainerslistUC
  extends IBaseUseCase<
    GetUserTrainersListQueryDTO,
    {
      userTrainersList: UserMyTrainersList[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IPurchaseSubscriptionUC
  extends IBaseUseCase<PurchaseSubscriptionDTO, string> {}

export interface IVerifySubscriptionSessionUC
  extends IBaseUseCase<
    string,
    UserSubscriptionPlan & { isSubscribed: boolean }
  > {}

export interface IWebHookHandlerUC
  extends IBaseUseCase<
    {
      sig: string;
      webhookSecret: string;
      body: string | Buffer;
    },
    void
  > {}
