import { UserVideoCallLog } from "../../../domain/entities/video-calllog.entities";
import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  AppointmentStatus,
  ApplicationStatus,
} from "../../../shared/constants/index.constants";
import { GetVideoCallLogQueryDTO } from "../../dtos/query-dtos";
import { PaginationDTO } from "../../dtos/utility-dtos";

export class UserVideoCallLogUseCase {
  constructor(private videoCallLogRepository: IVideoCallLogRepository) {}

  async getUserVideoCallLogs(
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
