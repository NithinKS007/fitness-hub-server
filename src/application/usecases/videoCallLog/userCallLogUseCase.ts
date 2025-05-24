import { UserVideoCallLog } from "../../../domain/entities/videoCallLog";
import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  AppointmentStatus,
} from "../../../shared/constants/index-constants";
import { parseDateRange } from "../../../shared/utils/dayjs";
import { GetVideoCallLogQueryDTO } from "../../dtos/query-dtos";
import { IdDTO, PaginationDTO } from "../../dtos/utility-dtos";

export class UserVideoCallLogUseCase {
  constructor(private videoCallLogRepository: IVideoCallLogRepository) {}

  public async getUserVideoCallLogs(
    userId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    userVideoCallLogList: UserVideoCallLog[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(AuthStatus.AllFieldsAreRequired);
    }

    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { userVideoCallLogList, paginationData } =
      await this.videoCallLogRepository.getUserVideoCallLogs(userId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });

    if (!userVideoCallLogList) {
      throw new validationError(
        AppointmentStatus.FailedToRetrieveVideoCallLogs
      );
    }
    return { userVideoCallLogList, paginationData };
  }
}
