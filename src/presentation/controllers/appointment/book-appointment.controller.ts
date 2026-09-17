import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_APPOINTMENT_USECASES } from "@di/types-usecases";
import { IBookAppointmentUC } from "@application/interfaces/usecases/IAppointmentUC";

@injectable()
export class BookAppointmentController {
  constructor(
    @inject(TYPES_APPOINTMENT_USECASES.BookAppointmentUseCase)
    private bookAppointmentUC: IBookAppointmentUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id:slotId } = req.params;
    const { id: userId } = req?.user || {};

    const bookingRequestData = { slotId, userId };
    const bookedSlotData = await this.bookAppointmentUC.execute(
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
