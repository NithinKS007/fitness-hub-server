import { Socket, Server } from "socket.io";
import { LoggerHelper } from "../../../../../shared/utils/handle.log";
import { TrainerGetUseCase } from "../../../../../application/usecases/trainer/get-trainer.usecase";
import { GetAppointmentByIdUseCase } from "../../../../../application/usecases/appointment/get-bookingby-id.usecase";
// import { validationError } from "../../../../../presentation/middlewares/error.middleware";
import { CreateVideoCallLogUseCase } from "../../../../../application/usecases/videoCallLog/create-videocalllog.usecase";
import { socketStore } from "../../store/socket.store";

interface InitiateVideoCall {
  io: Server;
  socket: Socket;
  callerId: string;
  receiverId: string;
  roomId: string;
  appointmentId: string;
  trainerGetUseCase: TrainerGetUseCase;
  getAppointmentByIdUseCase: GetAppointmentByIdUseCase;
  createVideoCallLogUseCase: CreateVideoCallLogUseCase;
}

export const handleInitiateCall = async ({
  io,
  socket,
  trainerGetUseCase,
  getAppointmentByIdUseCase,
  createVideoCallLogUseCase,
  callerId,
  receiverId,
  roomId,
  appointmentId,
}: InitiateVideoCall) => {
  const trainerData = await trainerGetUseCase.getTrainerDetailsById(callerId);
  const appointmentData = await getAppointmentByIdUseCase.execute(
    appointmentId
  );

  // if (appointmentData?.status === "cancelled") {
  //   throw new validationError("Failed to connect");
  // }

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
    return;
  }
  io.to(receiverSocketId).emit("incomingCall", {
    trainerName: trainerName,
    appointmentTime: appointmentTime,
    appointmentDate: appointmentDate,
    callerId: callerId,
    roomId: roomId,
    appointmentId: appointmentId,
  });
};
