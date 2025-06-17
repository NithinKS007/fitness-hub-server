import { Request, Response } from "express";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { CancelAppointmentUseCase } from "@application/usecases/appointment/cancel-appointment.usecase";

export class CancelAppointmentController {
  constructor(private cancelAppointmentUseCase: CancelAppointmentUseCase) {}

  async handleCancelAppointment(req: Request, res: Response): Promise<void> {
    const { appointmentId } = req.params;

    const cancelledAppointmentData =
      await this.cancelAppointmentUseCase.execute(appointmentId);

    sendResponse(
      res,
      StatusCodes.OK,
      cancelledAppointmentData,
      AppointmentStatus.AppointmentCancelledSuccessfully
    );
  }
}
