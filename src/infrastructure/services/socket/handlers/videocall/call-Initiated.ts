import { Server } from "socket.io";
import { socketStore } from "@infrastructure/services/socket/store/socket.store";
import { validationError } from "@presentation/middlewares/error.middleware";
import { VideoCallStatus } from "@shared/constants/videocallStatus/videocall.status";
import { IGetAppointmentByIdUC } from "@application/interfaces/usecases/IAppointmentUC";
import { ICreateVideoCallLogUC } from "@application/interfaces/usecases/IVideoCallLogUC";
import { EmitEvents } from "@application/dtos/service/socket.service";
import { IGetUserDetailsUC } from "@application/interfaces/usecases/IUserUC";

interface InitiateVideoCall {
  io: Server;
  callerId: string;
  receiverId: string;
  roomId: string;
  token: string;
  appId: number;
  appointmentId: string;
  getUserDetailsUseCase: IGetUserDetailsUC;
  getAppointmentByIdUseCase: IGetAppointmentByIdUC;
  createVideoCallLogUseCase: ICreateVideoCallLogUC;
}

export const handleInitiateCall = async ({
  io,
  getUserDetailsUseCase,
  getAppointmentByIdUseCase,
  createVideoCallLogUseCase,
  callerId,
  receiverId,
  roomId,
  token,
  appId,
  appointmentId,
}: InitiateVideoCall) => {
  try {
    const [trainerData, appointmentData] = await Promise.all([
      getUserDetailsUseCase.execute(callerId),
      getAppointmentByIdUseCase.execute(appointmentId),
    ]);

    if (!trainerData || !appointmentData) {
      throw new validationError(VideoCallStatus.UnableToConnect);
    }

    const trainerName = `${trainerData.fname} ${trainerData.lname}`;
    const appointmentTime = appointmentData?.appointmentTime ?? "N/A";
    const appointmentDate = appointmentData?.appointmentDate ?? "N/A";

    const createCall = await createVideoCallLogUseCase.execute({
      callerId: callerId,
      receiverId: receiverId,
      callRoomId: roomId,
      appointmentId: appointmentId,
      callStartTime: new Date(),
    });

    const receiverSocketId = socketStore.userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(EmitEvents.IncomingCall, {
        trainerName: trainerName,
        appointmentTime: appointmentTime,
        appointmentDate: appointmentDate,
        callerId: callerId,
        roomId: roomId,
        token: token,
        appId: appId,
        appointmentId: appointmentId,
      });
    }
  } catch (error: any) {
    io.to(receiverId).emit(EmitEvents.Error, {
      message:
        error.message ||
        "An unexpected error occurred while attempting to call.",
      status: "error",
      code: error.code || 500,
    });
  }
};
