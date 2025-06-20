import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, SlotStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { CreateBookingSlotUseCase } from "@application/usecases/bookingSlot/create-booking-slot.usecase";
import { TYPES_BOOKINGSLOT_USECASAES } from "di/types-usecases";

@injectable()
export class CreateBookingSlotController {
  constructor(
    @inject(TYPES_BOOKINGSLOT_USECASAES.CreateBookingSlotUseCase)
    private createBookingSlotUseCase: CreateBookingSlotUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};
    const bookingSlotData = {
      trainerId,
      ...req.body,
    };

    const createdSlotData = await this.createBookingSlotUseCase.execute(
      bookingSlotData
    );

    sendResponse(res, StatusCodes.OK, createdSlotData, SlotStatus.Created);
  }
}
