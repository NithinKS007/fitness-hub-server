import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { BookAppointmentUseCase } from "@application/usecases/appointment/book-appointment-usecase";
import { TYPES_APPOINTMENT_USECASES } from "di/types-usecases";

@injectable()
export class BookAppointmentController {
  constructor(
    @inject(TYPES_APPOINTMENT_USECASES.BookAppointmentUseCase)
    private bookAppointmentUseCase: BookAppointmentUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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
      AppointmentStatus.SlotBooked
    );
  }
}
