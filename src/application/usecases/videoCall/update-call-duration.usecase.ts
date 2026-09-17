import { IVideoCallLogRepository } from "@domain/interfaces/IVideoCallLogRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { UpdateVideoCallLogDTO } from "@application/dtos/video-call-dtos";
import { VideoCallLog } from "@domain/entities/video-calllog.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { VideoCallStatus } from "@shared/constants/videocallStatus/videocall.status";
import { IUpdateVideoCallStatusUC } from "@application/interfaces/usecases/IVideoCallLogUC";

/**
 * Purpose: Handle the process of updating the status of a video call log, including
 * marking the end time, call room ID, and call status.
 * Incoming: { callEndTime, callRoomId, callStatus } - Details about the call that needs to be updated.
 * Returns: IVideoCallLog or null - The updated video call log if successful, or null if not found.
 * Throws: validationError if any of the required fields are missing.
 */

@injectable()
export class UpdateVideoCallStatusUseCase implements IUpdateVideoCallStatusUC  {
  constructor(
    @inject(TYPES_REPOSITORIES.VideoCallLogRepository)
    private videoCallLogRepository: IVideoCallLogRepository
  ) {}

  async execute({
    callEndTime,
    callRoomId,
    callStatus,
  }: UpdateVideoCallLogDTO): Promise<VideoCallLog> {
    if (!callEndTime || !callRoomId || !callStatus) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const updatedCallData = { callEndTime, callRoomId, callStatus };

    const updatedCall = await this.videoCallLogRepository.updateStatus(
      updatedCallData
    );

    if (!updatedCall) {
      throw new validationError(VideoCallStatus.UnableToUpdateStatus);
    }

    return updatedCall;
  }
}
