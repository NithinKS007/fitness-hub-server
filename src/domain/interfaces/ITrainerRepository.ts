import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "../../application/dtos/queryDTOs";
import { IdDTO } from "../../application/dtos/utilityDTOs";
import { PaginationDTO } from "../../application/dtos/utilityDTOs";
import {
  CreateTrainerCollectionDTO,
  TrainerDTO,
} from "../../application/dtos/trainerDTOs";
import { TrainerVerificationDTO } from "../../application/dtos/trainerDTOs";
import { Trainer, TrainerSpecific } from "../entities/trainer";
import { TrainerWithSubscription } from "../entities/trainerWithSubscription";

export interface ITrainerRepository {
  create(createTrainer: CreateTrainerCollectionDTO): Promise<TrainerSpecific>;
  getTrainerDetailsById(trainerId: IdDTO): Promise<Trainer>;
  updateTrainerSpecificData(
    trainerUpdate: TrainerDTO
  ): Promise<TrainerSpecific | null>;
  getTrainers(
    searchFilterQuery: GetTrainersQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  getTrainerDetailsByUserIdRef(userId: IdDTO): Promise<Trainer>;
  approveRejectTrainerVerification(
    verificationData: TrainerVerificationDTO
  ): Promise<Trainer | null>;
  getApprovedTrainers(
    searchFilterQuery: GetApprovedTrainerQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  getApprovedTrainerDetailsWithSub(
    trainerId: IdDTO
  ): Promise<TrainerWithSubscription>;
  getApprovalPendingList(
    searchFilterQuery: GetTrainersApprovalQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  countPendingTrainerApprovals(): Promise<number>;
}
