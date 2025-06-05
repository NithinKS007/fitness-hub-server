import { UserVideoCallLog } from "../../../domain/entities/video-calllog.entities";
import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  AppointmentStatus,
  ApplicationStatus,
} from "../../../shared/constants/index.constants";
import { GetVideoCallLogQueryDTO } from "../../dtos/query-dtos";
import { PaginationDTO } from "../../dtos/utility-dtos";

/**
 * Purpose: Fetch video call logs for a user with pagination, filters, and date range.
 * Incoming: { userId, page, limit, fromDate, toDate, search, filters }
 * Returns: { userVideoCallLogList, paginationData }
 * Throws: Error if userId is missing or retrieval fails.
 */

export class GetUserVideoCallLogUseCase {
  constructor(private videoCallLogRepository: IVideoCallLogRepository) {}

  async execute(
    userId: string,
    { page, limit, fromDate, toDate, search, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    userVideoCallLogList: UserVideoCallLog[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters };
    const { userVideoCallLogList, paginationData } =
      await this.videoCallLogRepository.getUserVideoCallLogs(userId, query);

    if (!userVideoCallLogList) {
      throw new validationError(
        AppointmentStatus.FailedToRetrieveVideoCallLogs
      );
    }
    return { userVideoCallLogList, paginationData };
  }
}
