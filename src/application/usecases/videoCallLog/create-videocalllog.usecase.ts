import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ApplicationStatus } from "../../../shared/constants/index.constants";
import { CreateVideoCallLogDTO } from "../../dtos/video-call-dtos";

/**
 * Purpose: Create a video call log entry for a given appointment.
 * Incoming: { appointmentId, callRoomId, callStartTime, callerId, receiverId }
 * Returns: void (No return value)
 * Throws: Error if any required field is missing.
 */

export class CreateVideoCallLogUseCase {
  constructor(private videoCallLogRepository: IVideoCallLogRepository) {}
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
    const callDataCreate = {
      appointmentId,
      callRoomId,
      callStartTime,
      callerId,
      receiverId,
    };
    await this.videoCallLogRepository.create(callDataCreate);
  }
}
