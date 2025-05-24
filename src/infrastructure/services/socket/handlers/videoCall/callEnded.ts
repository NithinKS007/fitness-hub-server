import { Server } from "socket.io";
import { LoggerHelper } from "../../../../../shared/utils/handleLog";
import { UpdateVideoCallLogUseCase } from "../../../../../application/usecases/videoCallLog/updateVideoCallLogUseCase";

interface EndVideoCall {
  io: Server;
  loggerHelper: LoggerHelper;
  updateVideoCallLogUseCase: UpdateVideoCallLogUseCase;
  roomId: string;
}

export const handleCallEnded = async ({
  io,
  loggerHelper,
  updateVideoCallLogUseCase,
  roomId,
}: EndVideoCall) => {
  loggerHelper.handleLogInfo("info", `call ended in room ${roomId}`,{});
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
