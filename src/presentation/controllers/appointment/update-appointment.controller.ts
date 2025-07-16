import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_APPOINTMENT_USECASES } from "@di/types-usecases";
import { IHandleBookingApprovalUC } from "@application/interfaces/usecases/IAppointmentUC";

@injectable()
export class UpdateAppointmentController {
  constructor(
    @inject(TYPES_APPOINTMENT_USECASES.HandleBookingApprovalUseCase)
    private handleBookingApprovalUC: IHandleBookingApprovalUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { appointmentId, bookingSlotId, action } = req.body;

    const bookingRequestData = { appointmentId, bookingSlotId, action };

    const appointmentData = await this.handleBookingApprovalUC.execute(
      bookingRequestData
    );

    sendResponse(
      res,
      StatusCodes.OK,
      appointmentData,
      appointmentData.status === "approved"
        ? AppointmentStatus.BookingApproved
        : AppointmentStatus.BookingRejected
    );
  }
}
