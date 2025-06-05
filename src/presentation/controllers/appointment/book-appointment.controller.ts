import { Request, Response } from "express";
import {
  AppointmentStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { BookAppointmentUseCase } from "../../../application/usecases/appointment/book-appointment-usecase";

export class BookAppointmentController {
  constructor(private bookAppointmentUseCase: BookAppointmentUseCase) {}
  async handleBookAppointment(req: Request, res: Response): Promise<void> {
    const slotId = req.params.slotId;
    const userId = req?.user?._id;
    const bookingRequestData = {
      slotId,
      userId,
    };
    const bookedSlotData = await this.bookAppointmentUseCase.execute(
      bookingRequestData
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      bookedSlotData,
      AppointmentStatus.SlotBookedSuccessfully
    );
  }
}
