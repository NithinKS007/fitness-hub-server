import { Server } from "socket.io";
import { UpdateVideoCallStatusUseCase } from "@application/usecases/videoCallLog/update-call-duration.usecase";
import { UpdateVideoCallDurationUseCase } from "@application/usecases/videoCallLog/update-call-data.usecase";
import { validationError } from "@presentation/middlewares/error.middleware";
import { VideoCallStatus } from "@shared/constants/videocallStatus/videocall.status";

interface EndVideoCall {
  io: Server;
  updateVideoCallStatusUseCase: UpdateVideoCallStatusUseCase;
  updateVideoCallDurationUseCase: UpdateVideoCallDurationUseCase;
  roomId: string;
}

export const handleCallEnded = async ({
  io,
  updateVideoCallStatusUseCase,
  updateVideoCallDurationUseCase,
  roomId,
}: EndVideoCall) => {
  try {
    const endTime = new Date();
    const videoCallLogData = await updateVideoCallStatusUseCase.execute({
      callRoomId: roomId,
      callEndTime: endTime,
      callStatus: "completed",
    });

    if (!videoCallLogData) {
      throw new validationError(VideoCallStatus.UnableToUpdateStatus);
    }

    const { callStartTime, callEndTime } = videoCallLogData;
    const duration = Math.floor(
      (callEndTime.getTime() - callStartTime.getTime()) / 1000
    );
    await updateVideoCallDurationUseCase.execute({
      callRoomId: roomId,
      callDuration: duration,
    });

    io.to(roomId).emit("callEnded");
  } catch (error: any) {
    io.to(roomId).emit("error", {
      message:
        error.message || "An unexpected error occurred while ending the call.",
      status: "error",
      code: error.code || 500,
    });
  }
};
