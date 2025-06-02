import { TrainerVideoCallLog } from "../../../domain/entities/video-calllog.entities";
import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  AppointmentStatus,
  ApplicationStatus,
} from "../../../shared/constants/index.constants";
import { GetVideoCallLogQueryDTO } from "../../dtos/query-dtos";
import { PaginationDTO } from "../../dtos/utility-dtos";

export class TrainerVideoCallLogUseCase {
  constructor(private videoCallLogRepository: IVideoCallLogRepository) {}

  async getTrainerVideoCallLogs(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    trainerVideoCallLogList: TrainerVideoCallLog[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters };
    const { trainerVideoCallLogList, paginationData } =
      await this.videoCallLogRepository.getTrainerVideoCallLogs(
        trainerId,
        query
      );

    if (!trainerVideoCallLogList) {
      throw new validationError(
        AppointmentStatus.FailedToRetrieveVideoCallLogs
      );
    }
    return { trainerVideoCallLogList, paginationData };
  }
}
