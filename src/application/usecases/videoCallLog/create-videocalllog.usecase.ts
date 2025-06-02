import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ApplicationStatus } from "../../../shared/constants/index.constants";
import { CreateVideoCallLogDTO } from "../../dtos/video-call-dtos";

export class CreateVideoCallLogUseCase {
  constructor(private videoCallLogRepository: IVideoCallLogRepository) {}
  async createVideoCallLog({
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
    const dateToCreate = {
      appointmentId,
      callRoomId,
      callStartTime,
      callerId,
      receiverId,
    };
    await this.videoCallLogRepository.createCallLog(dateToCreate);
  }
}
