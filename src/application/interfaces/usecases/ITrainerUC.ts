import { IBaseUseCase } from "./IBase.UC";
import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import {
  TrainerVerificationDTO,
  TrainerWithSubscription,
} from "@application/dtos/trainer-dtos";
import { TrainerDTO } from "@application/dtos/trainer-dtos";
import { Trainer } from "@domain/entities/trainer.entity";
export interface IGetTrainersUC
  extends IBaseUseCase<
    GetTrainersQueryDTO,
    {
      trainersList: TrainerDTO[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetApprovedTrainers
  extends IBaseUseCase<
    GetApprovedTrainerQueryDTO,
    {
      trainersList: TrainerDTO[];
      paginationData: PaginationDTO;
    }
  > {}

export interface IGetTrainerDetailsUC extends IBaseUseCase<string, TrainerDTO> {}
export interface IGetTrainerAndSubInfoUC
  extends IBaseUseCase<string, TrainerWithSubscription> {}
export interface IGetVeryfyTrainerlist
  extends IBaseUseCase<
    GetTrainersApprovalQueryDTO,
    {
      trainersList: TrainerDTO[];
      paginationData: PaginationDTO;
    }
  > {}

export interface ITrainerApprovalUC
  extends IBaseUseCase<TrainerVerificationDTO, Trainer | null> {}
