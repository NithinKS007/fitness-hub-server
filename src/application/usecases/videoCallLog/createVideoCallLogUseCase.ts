import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthStatus } from "../../../shared/constants/index-constants";
import { CreateVideoCallLogDTO } from "../../dtos/video-call-dtos";

export class CreateVideoCallLogUseCase {
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
      throw new validationError(AuthStatus.AllFieldsAreRequired);
    }
    await this.videoCallLogRepository.createCallLog({
      appointmentId,
      callRoomId,
      callStartTime,
      callerId,
      receiverId,
    });
  }
}
