import { Server } from "socket.io";
import { UpdateVideoCallLogUseCase } from "../../../../../application/usecases/videoCallLog/update-videoCalllog.usecase";

interface EndVideoCall {
  io: Server;
  updateVideoCallLogUseCase: UpdateVideoCallLogUseCase;
  roomId: string;
}

export const handleCallEnded = async ({
  io,
  updateVideoCallLogUseCase,
  roomId,
}: EndVideoCall) => {
  const endTime = new Date();
  const videoCallLogData = await updateVideoCallLogUseCase.updateVideoCallLog({
    callRoomId: roomId,
    callEndTime: endTime,
    callStatus: "completed",
  });
  if (videoCallLogData) {
    const { callStartTime, callEndTime } = videoCallLogData;
    const duration = Math.floor(
      (callEndTime.getTime() - callStartTime.getTime()) / 1000
    );
    await updateVideoCallLogUseCase.updateVideoCallDuration({
      callRoomId: roomId,
      callDuration: duration,
    });
  }
  io.to(roomId).emit("callEnded");
};
