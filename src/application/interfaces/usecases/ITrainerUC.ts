import { IBaseUseCase } from "./IBase.UC";
import { GetTrainersDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import {
  TrainerVerificationDTO,
} from "@application/dtos/trainer-dtos";
import { Trainer } from "@domain/entities/trainer.entity";
import { User } from "@domain/entities/user.entity";

export interface IGetTrainersUC
  extends IBaseUseCase<
    GetTrainersDTO,
    {
      trainersList: (Omit<User, "password" | "createdAt" | "updatedAt"> & {
        trainerDetails: Omit<Trainer, "createdAt" | "updatedAt">;
      })[];
      paginationData: PaginationDTO;
    }
  > {}

export interface ITrainerApprovalUC
  extends IBaseUseCase<
    TrainerVerificationDTO,
    Omit<User, "password" | "createdAt" | "updatedAt"> & {
      trainerDetails: Omit<Trainer, "createdAt" | "updatedAt">;
    }
  > {}
