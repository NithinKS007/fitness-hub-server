import { Request, Response } from "express";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { HandleBookingApprovalUseCase } from "@application/usecases/appointment/handle-booking.usecase";

export class UpdateAppointmentController {
  constructor(
    private handleBookingApprovalUseCase: HandleBookingApprovalUseCase
  ) {}

  async handleBookingRequest(req: Request, res: Response): Promise<void> {
    const { appointmentId, bookingSlotId, action } = req.body;

    const bookingRequestData = { appointmentId, bookingSlotId, action };

    const appointmentData = await this.handleBookingApprovalUseCase.execute(
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
