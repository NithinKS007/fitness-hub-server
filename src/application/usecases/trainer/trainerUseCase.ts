import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "../../dtos/queryDTOs";
import { IdDTO } from "../../dtos/utilityDTOs";
import { PaginationDTO } from "../../dtos/utilityDTOs";
import { TrainerVerificationDTO } from "../../dtos/trainerDTOs";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthenticationStatusMessage, TrainerStatusMessage } from "../../../shared/constants/httpResponseStructure";
import { Trainer } from "../../../domain/entities/trainer";
import { TrainerWithSubscription } from "../../../domain/entities/trainerWithSubscription";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { parseDateRange } from "../../../shared/utils/dayjs";

export class TrainerUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  public async getTrainers({
    page,
    limit,
    search,
    filters,
  }: GetTrainersQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const { trainersList, paginationData } =
      await this.trainerRepository.getTrainers({
        page,
        limit,
        search,
        filters,
      });
    return {
      trainersList,
      paginationData,
    };
  }

  public async getTrainerDetailsById(trainerId: IdDTO): Promise<Trainer> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.IdRequired);
    }
    const trainerDetails = await this.trainerRepository.getTrainerDetailsById(
      trainerId
    );
    if (!trainerDetails) {
      throw new validationError(
        TrainerStatusMessage.FailedToRetrieveTrainerDetails
      );
    }
    return trainerDetails;
  }
  public async getApprovalPendingList({
    page,
    limit,
    fromDate,
    toDate,
    search,
  }: GetTrainersApprovalQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { trainersList, paginationData } =
      await this.trainerRepository.getApprovalPendingList({
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
      });
    if (!trainersList) {
      throw new validationError(
        TrainerStatusMessage.FailedToRetrieveTrainersList
      );
    }
    return {
      trainersList,
      paginationData,
    };
  }

  public async approveRejectTrainerVerification({
    trainerId,
    action,
  }: TrainerVerificationDTO): Promise<Trainer | null> {
    if (!trainerId || !action) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
    }
    return await this.trainerRepository.approveRejectTrainerVerification({
      trainerId,
      action,
    });
  }

  public async getApprovedTrainers({
    page,
    limit,
    Search,
    Sort,
    Experience,
    Gender,
    Specialization,
  }: GetApprovedTrainerQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const { trainersList, paginationData } =
      await this.trainerRepository.getApprovedTrainers({
        page,
        limit,
        Search,
        Sort,
        Experience,
        Gender,
        Specialization,
      });
    if (!trainersList) {
      throw new validationError(
        TrainerStatusMessage.FailedToRetrieveTrainersList
      );
    }
    return {
      trainersList,
      paginationData,
    };
  }
  public async getApprovedTrainerDetailsWithSub(
    trainerId: IdDTO
  ): Promise<TrainerWithSubscription> {
    const trainerData =
      await this.trainerRepository.getApprovedTrainerDetailsWithSub(trainerId);
    if (!trainerData) {
      throw new validationError(
        TrainerStatusMessage.FailedToRetrieveTrainerWithSubscription
      );
    }
    return trainerData;
  }
}
