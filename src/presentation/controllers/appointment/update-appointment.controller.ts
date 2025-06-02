import { Request, Response } from "express";
import {
  AppointmentStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { CancelAppointmentUseCase } from "../../../application/usecases/appointment/cancel-appointment.usecase";
import { HandleBookingApprovalUseCase } from "../../../application/usecases/appointment/handle-booking.usecase";

export class UpdateAppointmentController {
  constructor(
    private cancelAppointmentUseCase: CancelAppointmentUseCase,
    private handleBookingApprovalUseCase: HandleBookingApprovalUseCase
  ) {}
  async cancelAppointment(req: Request, res: Response): Promise<void> {
    const appointmentId = req.params.appointmentId;
    const cancelledAppointmentData =
      await this.cancelAppointmentUseCase.execute(appointmentId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      cancelledAppointmentData,
      AppointmentStatus.AppointmentCancelledSuccessfully
    );
  }
  async handleBookingRequest(req: Request, res: Response): Promise<void> {
    const { appointmentId, bookingSlotId, action } = req.body;
    const bookingRequestData = {
      appointmentId,
      bookingSlotId,
      action,
    };
    const appointmentData = await this.handleBookingApprovalUseCase.execute(
      bookingRequestData
    );
    if (appointmentData.status === "approved") {
      sendResponse(
        res,
        HttpStatusCodes.OK,
        appointmentData,
        AppointmentStatus.BookingApproved
      );
    } else if (appointmentData.status === "rejected") {
      sendResponse(
        res,
        HttpStatusCodes.OK,
        appointmentData,
        AppointmentStatus.BookingRejected
      );
    }
  }
}
