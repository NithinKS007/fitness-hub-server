import { Server } from "socket.io";
import { UpdateVideoCallLogUseCase } from "../../../../../application/usecases/videoCallLog/update-videoCalllog.usecase";

interface RejectVideoCall {
  io: Server;
  updateVideoCallLogUseCase: UpdateVideoCallLogUseCase;
  roomId: string;
}

export const handleCallRejected = async ({
  io,
  updateVideoCallLogUseCase,
  roomId,
}: RejectVideoCall) => {
  const endTime = new Date();
  const videoCallLogData = await updateVideoCallLogUseCase.updateVideoCallLog({
    callRoomId: roomId,
    callEndTime: endTime,
    callStatus: "missed",
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
