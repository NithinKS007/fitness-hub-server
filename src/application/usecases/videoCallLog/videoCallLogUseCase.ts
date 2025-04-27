import { TrainerVideoCallLog, UserVideoCallLog, VideoCallLog } from "../../../domain/entities/videoCallLog";
import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthenticationStatusMessage, VideoCallStatusMessage } from "../../../shared/constants/httpResponseStructure";
import { parseDateRange } from "../../../shared/utils/dayjs";
import { GetVideoCallLogQueryDTO } from "../../dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../dtos/utilityDTOs";
import {
  CreateVideoCallLogDTO,
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
} from "../../dtos/videoCallDTOs";

export class VideoCallLogUseCase {
  constructor(private videoCallLogRepository: IVideoCallLogRepository) {}
  public async createVideoCallLog({
    appointmentId,
    callRoomId,
    callStartTime,
    callerId,
    receiverId,
  }: CreateVideoCallLogDTO): Promise<void> {
    if (
      !appointmentId ||
      !callRoomId ||
      !callStartTime ||
      !callerId ||
      !receiverId
    ) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    await this.videoCallLogRepository.createCallLog({
      appointmentId,
      callRoomId,
      callStartTime,
      callerId,
      receiverId,
    });
  }
  public async updateVideoCallLog({
    callEndTime,
    callRoomId,
    callStatus,
  }: UpdateVideoCallLogDTO): Promise<VideoCallLog> {
    if (!callEndTime || !callRoomId || !callStatus) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    return await this.videoCallLogRepository.updateVideoCallLog({
      callEndTime,
      callRoomId,
      callStatus,
    });
  }
  public async updateVideoCallDuration({
    callDuration,
    callRoomId,
  }: UpdateVideoCallDurationDTO): Promise<void> {
    if (typeof callDuration !== "number" || !callRoomId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    await this.videoCallLogRepository.updateVideoCallDuration({
      callDuration,
      callRoomId,
    });
  }

  public async getTrainerVideoCallLogs(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    trainerVideoCallLogList: TrainerVideoCallLog[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
    }

    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { trainerVideoCallLogList, paginationData } =
      await this.videoCallLogRepository.getTrainerVideoCallLogs(trainerId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });

    if (!trainerVideoCallLogList) {
      throw new validationError(
        VideoCallStatusMessage.FailedToRetrieveVideoCallLogs
      );
    }
    return { trainerVideoCallLogList, paginationData };
  }

  public async getUserVideoCallLogs(
    userId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    userVideoCallLogList: UserVideoCallLog[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
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
        VideoCallStatusMessage.FailedToRetrieveVideoCallLogs
      );
    }
    return { userVideoCallLogList, paginationData };
  }
}
