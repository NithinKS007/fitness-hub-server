import { Server } from "socket.io";
import { validationError } from "@presentation/middlewares/error.middleware";
import { VideoCallStatus } from "@shared/constants/videocallStatus/videocall.status";
import {
  IUpdateVideoCallDurationUC,
  IUpdateVideoCallStatusUC,
} from "@application/interfaces/usecases/IVideoCallLogUC";
import { EmitEvents } from "@application/dtos/service/socket.service";

interface RejectVideoCall {
  io: Server;
  updateVideoCallStatusUseCase: IUpdateVideoCallStatusUC;
  updateVideoCallDurationUseCase: IUpdateVideoCallDurationUC;
  roomId: string;
}

export const handleCallRejected = async ({
  io,
  updateVideoCallStatusUseCase,
  updateVideoCallDurationUseCase,
  roomId,
}: RejectVideoCall) => {
  try {
    const endTime = new Date();
    const videoCallLogData = await updateVideoCallStatusUseCase.execute({
      callRoomId: roomId,
      callEndTime: endTime,
      callStatus: "missed",
    });

    if (!videoCallLogData) {
      throw new validationError(VideoCallStatus.UnableToUpdateStatus);
    }

    const duration = Math.floor(
      (videoCallLogData.callEndTime.getTime() -
        videoCallLogData.callStartTime.getTime()) /
        1000
    );

    await updateVideoCallDurationUseCase.execute({
      callRoomId: roomId,
      callDuration: duration,
    });

    io.to(roomId).emit(EmitEvents.callEnded);
  } catch (error: any) {
    io.to(roomId).emit(EmitEvents.error, {
      message:
        error.message ||
        "An unexpected error occurred while attempting to reject call.",
      status: "error",
      code: error.code || 500,
    });
  }
};
