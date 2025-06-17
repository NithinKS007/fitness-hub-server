import { Request, Response } from "express";
import { StatusCodes, SlotStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { CreateBookingSlotUseCase } from "@application/usecases/bookingSlot/create-booking-slot.usecase";

export class CreateBookingSlotController {
  constructor(private createBookingSlotUseCase: CreateBookingSlotUseCase) {}

  async handleAddSlot(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};
    const bookingSlotData = {
      trainerId,
      ...req.body,
    };

    const createdSlotData = await this.createBookingSlotUseCase.execute(
      bookingSlotData
    );

    sendResponse(
      res,
      StatusCodes.OK,
      createdSlotData,
      SlotStatus.SlotCreatedSuccessfully
    );
  }
}
