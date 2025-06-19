import { IVideoCallLogRepository } from "@domain/interfaces/IVideoCallLogRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { CreateVideoCallLogDTO } from "@application/dtos/video-call-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

/**
 * Purpose: Create a video call log entry for a given appointment.
 * Incoming: { appointmentId, callRoomId, callStartTime, callerId, receiverId }
 * Returns: void (No return value)
 * Throws: Error if any required field is missing.
 */

@injectable()
export class CreateVideoCallLogUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.VideoCallLogRepository)
    private videoCallLogRepository: IVideoCallLogRepository
  ) {}
  
  async execute({
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
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const callData = {
      appointmentId,
      callRoomId,
      callStartTime,
      callerId,
      receiverId,
    };
    await this.videoCallLogRepository.create(callData);
  }
}
