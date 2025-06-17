import { Socket, Server } from "socket.io";
import { GetAppointmentByIdUseCase } from "@application/usecases/appointment/get-bookingby-id.usecase";
import { CreateVideoCallLogUseCase } from "@application/usecases/videoCallLog/create-videocalllog.usecase";
import { socketStore } from "@infrastructure/services/socket/store/socket.store";
import { GetTrainerDetailsUseCase } from "@application/usecases/trainer/get-trainer-details.usecase";

interface InitiateVideoCall {
  io: Server;
  socket: Socket;
  callerId: string;
  receiverId: string;
  roomId: string;
  appointmentId: string;
  getTrainerDetailsUseCase: GetTrainerDetailsUseCase;
  getAppointmentByIdUseCase: GetAppointmentByIdUseCase;
  createVideoCallLogUseCase: CreateVideoCallLogUseCase;
}

export const handleInitiateCall = async ({
  io,
  socket,
  getTrainerDetailsUseCase,
  getAppointmentByIdUseCase,
  createVideoCallLogUseCase,
  callerId,
  receiverId,
  roomId,
  appointmentId,
}: InitiateVideoCall) => {
  const trainerData = await getTrainerDetailsUseCase.execute(callerId);
  const appointmentData = await getAppointmentByIdUseCase.execute(
    appointmentId
  );

  const trainerName = `${trainerData.fname} ${trainerData.lname}`;
  const appointmentTime = appointmentData?.appointmentTime;
  const appointmentDate = appointmentData?.appointmentDate;
  await createVideoCallLogUseCase.execute({
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
