import { VideoCallLog } from "../../domain/entities/videoCallLogEntity";
import { IVideoCallLogRepository } from "../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import {
  CreateVideoCallLogDTO,
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
} from "../dtos/videoCallDTOs";

export class VideoCallUseCase {
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
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
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
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
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
    if (!callDuration || !callRoomId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    await this.videoCallLogRepository.updateVideoCallDuration({
      callDuration,
      callRoomId,
    });
  }
}
