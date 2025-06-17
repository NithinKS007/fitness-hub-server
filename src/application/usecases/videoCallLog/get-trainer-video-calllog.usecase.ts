import { IVideoCallLogRepository } from "@domain/interfaces/IVideoCallLogRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  AppointmentStatus,
  ApplicationStatus,
} from "@shared/constants/index.constants";
import { GetVideoCallLogQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { TrainerVideoCallLog } from "@application/dtos/video-call-dtos";

/**
 * Purpose: Fetch video call logs for a trainer with pagination, filters, and date range.
 * Incoming: { trainerId, page, limit, fromDate, toDate, search, filters }
 * Returns: { trainerVideoCallLogList, paginationData }
 * Throws: Error if trainerId is missing or retrieval fails.
 */

export class GetTrainerVideoCallLogUseCase {
  constructor(private videoCallLogRepository: IVideoCallLogRepository) {}
  async execute(
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
