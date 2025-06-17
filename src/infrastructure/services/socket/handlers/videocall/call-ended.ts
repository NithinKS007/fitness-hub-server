import { Server } from "socket.io";
import { UpdateVideoCallStatusUseCase } from "@application/usecases/videoCallLog/update-call-duration.usecase";
import { UpdateVideoCallDurationUseCase } from "@application/usecases/videoCallLog/update-call-data.usecase";

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
  const endTime = new Date();
  const videoCallLogData = await updateVideoCallStatusUseCase.execute({
    callRoomId: roomId,
    callEndTime: endTime,
    callStatus: "completed",
  });
  if (videoCallLogData) {
    const { callStartTime, callEndTime } = videoCallLogData;
    const duration = Math.floor(
      (callEndTime.getTime() - callStartTime.getTime()) / 1000
    );
    await updateVideoCallDurationUseCase.execute({
      callRoomId: roomId,
      callDuration: duration,
    });
  }
  io.to(roomId).emit("callEnded");
};
