import { VideoCallLog } from "../../../domain/entities/videoCallLog";
import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthStatus } from "../../../shared/constants/index-constants";
import {
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
} from "../../dtos/video-call-dtos";

export class UpdateVideoCallLogUseCase {
  constructor(private videoCallLogRepository: IVideoCallLogRepository) {}

  public async updateVideoCallLog({
    callEndTime,
    callRoomId,
    callStatus,
  }: UpdateVideoCallLogDTO): Promise<VideoCallLog> {
    if (!callEndTime || !callRoomId || !callStatus) {
      throw new validationError(AuthStatus.AllFieldsAreRequired);
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
      throw new validationError(AuthStatus.AllFieldsAreRequired);
    }
    await this.videoCallLogRepository.updateVideoCallDuration({
      callDuration,
      callRoomId,
    });
  }
}
