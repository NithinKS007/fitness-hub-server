import { Server } from "socket.io";
import { GetAppointmentByIdUseCase } from "@application/usecases/appointment/get-bookingby-id.usecase";
import { CreateVideoCallLogUseCase } from "@application/usecases/videoCallLog/create-videocalllog.usecase";
import { socketStore } from "@infrastructure/services/socket/store/socket.store";
import { GetTrainerDetailsUseCase } from "@application/usecases/trainer/get-trainer-details.usecase";
import { validationError } from "@presentation/middlewares/error.middleware";
import { VideoCallStatus } from "@shared/constants/videocallStatus/videocall.status";

interface InitiateVideoCall {
  io: Server;
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
  getTrainerDetailsUseCase,
  getAppointmentByIdUseCase,
  createVideoCallLogUseCase,
  callerId,
  receiverId,
  roomId,
  appointmentId,
}: InitiateVideoCall) => {
  try {
    const [trainerData, appointmentData] = await Promise.all([
      getTrainerDetailsUseCase.execute(callerId),
      getAppointmentByIdUseCase.execute(appointmentId),
    ]);

    if (!trainerData || !appointmentData) {
      throw new validationError(VideoCallStatus.UnableToConnect);
    }

    const trainerName = `${trainerData.fname} ${trainerData.lname}`;
    const appointmentTime = appointmentData?.appointmentTime ?? "N/A";
    const appointmentDate = appointmentData?.appointmentDate ?? "N/A";

    await createVideoCallLogUseCase.execute({
      callerId: callerId,
      receiverId: receiverId,
      callRoomId: roomId,
      appointmentId: appointmentId,
      callStartTime: new Date(),
    });

    const receiverSocketId = socketStore.userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incomingCall", {
        trainerName: trainerName,
        appointmentTime: appointmentTime,
        appointmentDate: appointmentDate,
        callerId: callerId,
        roomId: roomId,
        appointmentId: appointmentId,
      });
    }
  } catch (error: any) {
    io.to(receiverId).emit("error", {
      message: error.message || "An unexpected error occurred while attempting to call.",
      status: "error",
      code: error.code || 500,
    });
  }
};
