import { GetApprovedTrainerQueryDTO, GetTrainersApprovalQueryDTO, GetTrainersQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO } from "../../application/dtos/utilityDTOs";
import { PaginationDTO } from "../../application/dtos/utilityDTOs";
import { CreateTrainerCollectionDTO, CreateTrainerDTO, TrainerDTO } from "../../application/dtos/trainerDTOs";
import { TrainerVerificationDTO } from "../../application/dtos/trainerDTOs";
import { Trainer, TrainerSpecific } from "../entities/trainerEntity";
import { TrainerWithSubscription } from "../entities/trainerWithSubscription";

export interface TrainerRepository {
  create(data: CreateTrainerCollectionDTO): Promise<TrainerSpecific>;
  getTrainerDetailsById(data:IdDTO):Promise<Trainer>
  updateTrainerSpecificData(data:TrainerDTO):Promise<TrainerSpecific| null>
  getTrainers(data:GetTrainersQueryDTO):Promise<{trainersList:Trainer[],paginationData:PaginationDTO}>
  getTrainerDetailsByUserIdRef(data:IdDTO):Promise<Trainer>
  approveRejectTrainerVerification(data:TrainerVerificationDTO):Promise<Trainer | null>
  getApprovedTrainers(searchFilterQuery:GetApprovedTrainerQueryDTO):Promise<{trainersList:Trainer[],paginationData:PaginationDTO}>
  getApprovedTrainerDetailsWithSub(data:IdDTO):Promise<TrainerWithSubscription>
  getApprovalPendingList(data:GetTrainersApprovalQueryDTO):Promise<{trainersList:Trainer[],paginationData:PaginationDTO}>
  countPendingTrainerApprovals():Promise<number>
}
