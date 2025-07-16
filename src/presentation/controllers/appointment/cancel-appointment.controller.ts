import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_APPOINTMENT_USECASES } from "@di/types-usecases";
import { ICancelAppointmentUC } from "@application/interfaces/usecases/IAppointmentUC";

@injectable()
export class CancelAppointmentController {
  constructor(
    @inject(TYPES_APPOINTMENT_USECASES.CancelAppointmentUseCase)
    private cancelAppointmentUC: ICancelAppointmentUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: appointmentId } = req.params;

    const cancelledAppointmentData = await this.cancelAppointmentUC.execute(
      appointmentId
    );

    sendResponse(
      res,
      StatusCodes.OK,
      cancelledAppointmentData,
      AppointmentStatus.AppointmentCancelledSuccessfully
    );
  }
}
