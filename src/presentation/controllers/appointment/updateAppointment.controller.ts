import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppointmentStatus, StatusCodes } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_APPOINTMENT_USECASES } from "@di/types-usecases";
import {
  ICancelAppointmentUC,
  IHandleBookingApprovalUC,
} from "@application/interfaces/usecases/IAppointmentUC";

@injectable()
export class UpdateAppointmentController {
  constructor(
    @inject(TYPES_APPOINTMENT_USECASES.CancelAppointmentUseCase)
    private cancelAppointmentUC: ICancelAppointmentUC,
    @inject(TYPES_APPOINTMENT_USECASES.HandleBookingApprovalUseCase)
    private handleBookingApprovalUC: IHandleBookingApprovalUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: appointmentId } = req.params;
    const { action } = req.body;

    if (action === "cancel") {
      const cancelledAppointmentData = await this.cancelAppointmentUC.execute({
        appointmentId,
        action,
      });

      sendResponse(
        res,
        StatusCodes.OK,
        cancelledAppointmentData,
        AppointmentStatus.AppointmentCancelledSuccessfully
      );
      return;
    } else if (action === "approved" || action === "rejected") {
      const bookingRequestData = { appointmentId, action };

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
      return;
    } else {
      sendResponse(res, StatusCodes.BadRequest, null, "Invalid action");
      return;
    }
  }
}
