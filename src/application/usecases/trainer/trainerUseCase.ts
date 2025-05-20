import {
  GetApprovedTrainerQueryDTO,
  GetTrainersApprovalQueryDTO,
  GetTrainersQueryDTO,
} from "../../dtos/query-dtos";
import { IdDTO } from "../../dtos/utility-dtos";
import { PaginationDTO } from "../../dtos/utility-dtos";
import { TrainerVerificationDTO } from "../../dtos/trainer-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthStatus, TrainerStatus } from "../../../shared/constants/index-constants";
import { Trainer ,TrainerWithSubscription } from "../../../domain/entities/trainer";
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
      throw new validationError(AuthStatus.IdRequired);
    }
    const trainerDetails = await this.trainerRepository.getTrainerDetailsById(
      trainerId
    );
    if (!trainerDetails) {
      throw new validationError(
        TrainerStatus.FailedToRetrieveTrainerDetails
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
        TrainerStatus.FailedToRetrieveTrainersList
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
      throw new validationError(AuthStatus.AllFieldsAreRequired);
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
        TrainerStatus.FailedToRetrieveTrainersList
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
        TrainerStatus.FailedToRetrieveTrainerWithSubscription
      );
    }
    return trainerData;
  }
}
