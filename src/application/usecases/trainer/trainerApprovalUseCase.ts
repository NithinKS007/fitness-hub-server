import { GetTrainersApprovalQueryDTO } from "../../dtos/query-dtos";
import { PaginationDTO } from "../../dtos/utility-dtos";
import { TrainerVerificationDTO } from "../../dtos/trainer-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  TrainerStatus,
} from "../../../shared/constants/index-constants";
import { Trainer } from "../../../domain/entities/trainer";
import { parseDateRange } from "../../../shared/utils/dayjs";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";

export class TrainerApprovalUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}
  public async getPendingList({
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
      await this.trainerRepository.getPendingList({
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
      });
    if (!trainersList) {
      throw new validationError(TrainerStatus.FailedToRetrieveTrainersList);
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
}
