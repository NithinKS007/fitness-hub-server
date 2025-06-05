import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { Trainer } from "../entities/trainer.entities";
import { TrainerWithSubscription } from "../entities/trainer.entities";
import { IBaseRepository } from "./IBaseRepository";
import { ITrainer } from "../../infrastructure/databases/models/trainer.model";

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
