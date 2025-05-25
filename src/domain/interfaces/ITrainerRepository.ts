import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "../../application/dtos/query-dtos";
import { IdDTO } from "../../application/dtos/utility-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import {
  CreateTrainerCollectionDTO,
  TrainerDTO,
} from "../../application/dtos/trainer-dtos";
import { TrainerVerificationDTO } from "../../application/dtos/trainer-dtos";
import { Trainer, TrainerSpecific } from "../entities/trainer";
import { TrainerWithSubscription } from "../entities/trainer";

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
  handleVerification(
    verificationData: TrainerVerificationDTO
  ): Promise<Trainer | null>;
  getApprovedTrainers(
    searchFilterQuery: GetApprovedTrainerQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  getApprovedTrainerDetailsWithSub(
    trainerId: IdDTO
  ): Promise<TrainerWithSubscription>;
  getPendingList(
    searchFilterQuery: GetTrainersApprovalQueryDTO
  ): Promise<{ trainersList: Trainer[]; paginationData: PaginationDTO }>;
  countPendingTrainerApprovals(): Promise<number>;
}
