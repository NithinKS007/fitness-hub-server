import { VideoCallLog } from "../../../domain/entities/video-calllog.entities";
import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ApplicationStatus } from "../../../shared/constants/index.constants";
import {
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
} from "../../dtos/video-call-dtos";

export class UpdateVideoCallLogUseCase {
  constructor(private videoCallLogRepository: IVideoCallLogRepository) {}

  async updateVideoCallLog({
    callEndTime,
    callRoomId,
    callStatus,
  }: UpdateVideoCallLogDTO): Promise<VideoCallLog | null> {
    if (!callEndTime || !callRoomId || !callStatus) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const dataToUpdate = { callEndTime, callRoomId, callStatus };
    return await this.videoCallLogRepository.updateVideoCallLog(dataToUpdate);
  }
  async updateVideoCallDuration({
    callDuration,
    callRoomId,
  }: UpdateVideoCallDurationDTO): Promise<void> {
    if (typeof callDuration !== "number" || !callRoomId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const dataToUpdate = { callDuration, callRoomId };
    await this.videoCallLogRepository.updateVideoCallDuration(dataToUpdate);
  }
}
