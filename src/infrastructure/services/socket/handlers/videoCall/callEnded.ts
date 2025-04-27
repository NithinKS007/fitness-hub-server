import { Server } from "socket.io";
import { LoggerHelper } from "../../../../../shared/utils/handleLog";
import { VideoCallLogUseCase } from "../../../../../application/usecases/videoCallLog/videoCallLogUseCase";

interface EndVideoCall {
  io: Server;
  loggerHelper: LoggerHelper;
  videoCallLogUseCase: VideoCallLogUseCase;
  roomId: string;
}

export const handleCallEnded = async ({
  io,
  loggerHelper,
  videoCallLogUseCase,
  roomId,
}: EndVideoCall) => {
  loggerHelper.handleLogInfo("info", `call ended in room ${roomId}`,{});
  const endTime = new Date();
  const videoCallLogData = await videoCallLogUseCase.updateVideoCallLog({
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
    await videoCallLogUseCase.updateVideoCallDuration({
      callRoomId: roomId,
      callDuration: duration,
    });
  }
  io.to(roomId).emit("callEnded");
};
