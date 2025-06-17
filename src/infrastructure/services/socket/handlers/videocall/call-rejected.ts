import { Server } from "socket.io";
import { UpdateVideoCallStatusUseCase } from "@application/usecases/videoCallLog/update-call-duration.usecase";
import { UpdateVideoCallDurationUseCase } from "@application/usecases/videoCallLog/update-call-data.usecase";

interface RejectVideoCall {
  io: Server;
  updateVideoCallStatusUseCase: UpdateVideoCallStatusUseCase;
  updateVideoCallDurationUseCase: UpdateVideoCallDurationUseCase;
  roomId: string;
}

export const handleCallRejected = async ({
  io,
  updateVideoCallStatusUseCase,
  updateVideoCallDurationUseCase,
  roomId,
}: RejectVideoCall) => {
  const endTime = new Date();
  const videoCallLogData = await updateVideoCallStatusUseCase.execute({
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
    await updateVideoCallDurationUseCase.execute({
      callRoomId: roomId,
      callDuration: duration,
    });
  }
  io.to(roomId).emit("callEnded");
};
