import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "../../dtos/query-dtos";
import { PaginationDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  AuthStatus,
  TrainerStatus,
} from "../../../shared/constants/index.constants";
import {
  Trainer,
  TrainerWithSubscription,
} from "../../../domain/entities/trainer.entities";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";

export class TrainerGetUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async getTrainers({
    page,
    limit,
    search,
    filters,
  }: GetTrainersQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, search, filters };
    const { trainersList, paginationData } =
      await this.trainerRepository.getTrainers(query);
    return {
      trainersList,
      paginationData,
    };
  }

  async getTrainerDetailsById(trainerId: string): Promise<Trainer> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const trainerDetails = await this.trainerRepository.getTrainerDetailsById(
      trainerId
    );
    if (!trainerDetails) {
      throw new validationError(TrainerStatus.FailedToRetrieveTrainerDetails);
    }
    return trainerDetails;
  }

  async getApprovedTrainers({
    page,
    limit,
    search,
    sort,
    experience,
    gender,
    specialization,
  }: GetApprovedTrainerQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const query = {
      page,
      limit,
      search,
      sort,
      experience,
      gender,
      specialization,
    };
    const { trainersList, paginationData } =
      await this.trainerRepository.getApprovedTrainers(query);
    if (!trainersList) {
      throw new validationError(TrainerStatus.FailedToRetrieveTrainersList);
    }
    return {
      trainersList,
      paginationData,
    };
  }
  async getTrainerWithSub(trainerId: string): Promise<TrainerWithSubscription> {
    const trainerData = await this.trainerRepository.getTrainerWithSub(
      trainerId
    );
    if (!trainerData) {
      throw new validationError(
        TrainerStatus.FailedToRetrieveTrainerWithSubscription
      );
    }
    return trainerData;
  }
  async getVerifyPendingList({
    page,
    limit,
    fromDate,
    toDate,
    search,
  }: GetTrainersApprovalQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, fromDate, toDate, search };
    const { trainersList, paginationData } =
      await this.trainerRepository.getVerifyPendingList(query);
    if (!trainersList) {
      throw new validationError(TrainerStatus.FailedToRetrieveTrainersList);
    }
    return {
      trainersList,
      paginationData,
    };
  }
}
