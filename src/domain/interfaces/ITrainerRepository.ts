import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "@application/dtos/query-dtos";
import { Trainer, TrainerWithSubscription } from "@application/dtos/trainer-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { ITrainer } from "@domain/entities/trainer.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface ITrainerRepository extends IBaseRepository<ITrainer> {
  getTrainerDetailsById(trainerId: string): Promise<Trainer>;
  getTrainers(
    searchFilterQuery: GetTrainersQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  getTrainerDetailsByUserIdRef(userId: string): Promise<Trainer>;
  getApprovedTrainers(
    searchFilterQuery: GetApprovedTrainerQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  getTrainerWithSub(trainerId: string): Promise<TrainerWithSubscription>;
  getVerifyPendingList(
    searchFilterQuery: GetTrainersApprovalQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  countPendingTrainerApprovals(): Promise<number>;
}
