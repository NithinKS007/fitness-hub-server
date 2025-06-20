import { IVideoCallLogRepository } from "@domain/interfaces/IVideoCallLogRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  AppointmentStatus,
  ApplicationStatus,
} from "@shared/constants/index.constants";
import { GetVideoCallLogQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { UserVideoCallLog } from "@application/dtos/video-call-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";
import { VideoCallStatus } from "@shared/constants/videocallStatus/videocall.status";

/**
 * Purpose: Fetch video call logs for a user with pagination, filters, and date range.
 * Incoming: { userId, page, limit, fromDate, toDate, search, filters }
 * Returns: { userVideoCallLogList, paginationData }
 * Throws: Error if userId is missing or retrieval fails.
 */

@injectable()
export class GetUserVideoCallLogUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.VideoCallLogRepository)
    private videoCallLogRepository: IVideoCallLogRepository
  ) {}

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
      throw new validationError(VideoCallStatus.RetrieveFailed);
    }
    return { userVideoCallLogList, paginationData };
  }
}
