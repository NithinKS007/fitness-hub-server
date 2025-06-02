import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import {
  CreateTrainerCollectionDTO,
  TrainerDTO,
} from "../../application/dtos/trainer-dtos";
import { TrainerVerificationDTO } from "../../application/dtos/trainer-dtos";
import { Trainer, TrainerSpecific } from "../entities/trainer.entities";
import { TrainerWithSubscription } from "../entities/trainer.entities";

export interface ITrainerRepository {
  create(createTrainer: CreateTrainerCollectionDTO): Promise<TrainerSpecific>;
  getTrainerDetailsById(trainerId: string): Promise<Trainer>;
  updateTrainerData(
    trainerUpdate: TrainerDTO
  ): Promise<TrainerSpecific | null>;
  getTrainers(
    searchFilterQuery: GetTrainersQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  getTrainerDetailsByUserIdRef(userId: string): Promise<Trainer>;
  handleVerification(
    verificationData: TrainerVerificationDTO
  ): Promise<Trainer | null>;
  getApprovedTrainers(
    searchFilterQuery: GetApprovedTrainerQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  getTrainerWithSub(
    trainerId: string
  ): Promise<TrainerWithSubscription>;
  getVerifyPendingList(
    searchFilterQuery: GetTrainersApprovalQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  countPendingTrainerApprovals(): Promise<number>;
}
