import { Request, Response } from "express";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { BookAppointmentUseCase } from "@application/usecases/appointment/book-appointment-usecase";

export class BookAppointmentController {
  constructor(private bookAppointmentUseCase: BookAppointmentUseCase) {}

  async handleBookAppointment(req: Request, res: Response): Promise<void> {
    const { slotId } = req.params;
    const { _id: userId } = req?.user || {};

    const bookingRequestData = { slotId, userId };
    const bookedSlotData = await this.bookAppointmentUseCase.execute(
      bookingRequestData
    );

    sendResponse(
      res,
      StatusCodes.OK,
      bookedSlotData,
      AppointmentStatus.SlotBookedSuccessfully
    );
  }
}
