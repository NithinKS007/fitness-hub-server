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
  if (videoCallLogData?.callStartTime && videoCallLogData?.callEndTime) {
    const duration = Math.floor(
      (videoCallLogData.callEndTime.getTime() -
        videoCallLogData.callStartTime.getTime()) /
        1000
    );
    await updateVideoCallLogUseCase.updateVideoCallDuration({
      callRoomId: roomId,
      callDuration: duration,
    });
  }
  io.to(roomId).emit("callEnded");
};
