import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "@application/dtos/query-dtos";
import {
  TrainerDTO,
  TrainerWithSubscription,
} from "@application/dtos/trainer-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { Trainer as TrainerDomain } from "@domain/entities/trainer.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { ITrainer } from "@infrastructure/databases/models/trainer.model";

export interface ITrainerRepository
  extends IBaseRepository<ITrainer, TrainerDomain> {
  getTrainerDetailsById(trainerId: string): Promise<TrainerDTO>;
  getTrainers(
    searchFilterQuery: GetTrainersQueryDTO
  ): Promise<{ trainersList: TrainerDTO[]; paginationData: PaginationDTO }>;
  getTrainerDetailsByUserIdRef(userId: string): Promise<TrainerDTO>;
  getApprovedTrainers(
    searchFilterQuery: GetApprovedTrainerQueryDTO
  ): Promise<{ trainersList: TrainerDTO[]; paginationData: PaginationDTO }>;
  getTrainerWithSub(trainerId: string): Promise<TrainerWithSubscription>;
  getVerifyPendingList(
    searchFilterQuery: GetTrainersApprovalQueryDTO
  ): Promise<{ trainersList: TrainerDTO[]; paginationData: PaginationDTO }>;
  countPendingTrainerApprovals(): Promise<number>;
}
