import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { CancelAppointmentUseCase } from "@application/usecases/appointment/cancel-appointment.usecase";
import { TYPES_APPOINTMENT_USECASES } from "@di/types-usecases";

@injectable()
export class CancelAppointmentController {
  constructor(
    @inject(TYPES_APPOINTMENT_USECASES.CancelAppointmentUseCase)
    private cancelAppointmentUseCase: CancelAppointmentUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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
