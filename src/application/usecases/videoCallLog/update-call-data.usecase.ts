import { IVideoCallLogRepository } from "@domain/interfaces/IVideoCallLogRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { UpdateVideoCallDurationDTO } from "@application/dtos/video-call-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

/**
 * Purpose: Handle the process of updating the duration of a video call.
 * Incoming: { callDuration, callRoomId } - The new duration of the call and the room ID to identify the call.
 * Returns: void (No return value) - The function performs an update and doesn't need to return any data.
 * Throws: validationError if the call duration is not a number or if the callRoomId is missing.
 */

@injectable()
export class UpdateVideoCallDurationUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.VideoCallLogRepository)
    private videoCallLogRepository: IVideoCallLogRepository
  ) {}
  
  async execute({
    callDuration,
    callRoomId,
  }: UpdateVideoCallDurationDTO): Promise<void> {
    if (typeof callDuration !== "number" || !callRoomId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const callData = { callDuration, callRoomId };
    await this.videoCallLogRepository.updateDuration(callData);
  }
}
