import { Socket, Server } from "socket.io";
import { LoggerHelper } from "../../../../../shared/utils/handleLog";
import { TrainerGetUseCase } from "../../../../../application/usecases/trainer/trainerGetUseCase";
import { GetAppointmentUsecase } from "../../../../../application/usecases/appointment/getAppointmentUseCase";
import { validationError } from "../../../../../presentation/middlewares/errorMiddleWare";
import { CreateVideoCallLogUseCase } from "../../../../../application/usecases/videoCallLog/createVideoCallLogUseCase";
import { socketStore } from "../../socketStore/socketStore";

interface InitiateVideoCall {
  io: Server;
  socket: Socket;
  callerId: string;
  receiverId: string;
  roomId: string;
  appointmentId: string;
  loggerHelper: LoggerHelper;
  trainerGetUseCase: TrainerGetUseCase;
  getAppointmentUseCase: GetAppointmentUsecase;
  createVideoCallLogUseCase: CreateVideoCallLogUseCase;
}

export const handleInitiateCall = async ({
  io,
  socket,
  loggerHelper,
  trainerGetUseCase,
  getAppointmentUseCase,
  createVideoCallLogUseCase,
  callerId,
  receiverId,
  roomId,
  appointmentId,
}: InitiateVideoCall) => {
  loggerHelper.handleLogInfo(
    "info",
    `video call initiated by ${callerId} to ${receiverId} in room ${roomId}`,
    { socketId: socket.id }
  );
  const trainerData = await trainerGetUseCase.getTrainerDetailsById(callerId);
  const appointmentData = await getAppointmentUseCase.getAppointmentById(
    appointmentId
  );

  if (appointmentData?.status === "cancelled") {
    loggerHelper.handleLogInfo(
      "info",
      `call to ${receiverId} failed: Appointment cancelled`,
      { socketId: socket.id }
    );
    throw new validationError("Failed to connect");
  }

  const trainerName = `${trainerData.fname} ${trainerData.lname}`;
  const appointmentTime = appointmentData?.appointmentTime;
  const appointmentDate = appointmentData?.appointmentDate;
  await createVideoCallLogUseCase.createVideoCallLog({
    callerId: callerId,
    receiverId: receiverId,
    callRoomId: roomId,
    appointmentId: appointmentId,
    callStartTime: new Date(),
  });

  const receiverSocketId = socketStore.userSocketMap.get(receiverId);
  if (!receiverSocketId) {
    loggerHelper.handleLogInfo(
      "info",
      `no socket found for receiverId: ${receiverId}`,
      { socketId: socket.id }
    );
    return;
  }

  loggerHelper.handleLogInfo(
    "info",
    `emitting incomingCall to socket ${receiverSocketId} for user ${receiverId}`,
    {
      trainerName,
      appointmentTime,
      appointmentDate,
      callerId,
      roomId,
      appointmentId,
    }
  );

  io.to(receiverSocketId).emit("incomingCall", {
    trainerName: trainerName,
    appointmentTime: appointmentTime,
    appointmentDate: appointmentDate,
    callerId: callerId,
    roomId: roomId,
    appointmentId: appointmentId,
  });
};
