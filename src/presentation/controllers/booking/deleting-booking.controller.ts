import { Request, Response } from "express";
import { StatusCodes, SlotStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { DeleteBookingSlotUseCase } from "@application/usecases/bookingSlot/delete-booking-slot.usecase";

export class DeleteBookingSlotController {
  constructor(private deleteBookingSlotUseCase: DeleteBookingSlotUseCase) {}

  async handleDeleteSlot(req: Request, res: Response): Promise<void> {
    const { bookingSlotId } = req.params;

    const deletedSlotData = await this.deleteBookingSlotUseCase.execute(
      bookingSlotId
    );

    sendResponse(
      res,
      StatusCodes.OK,
      deletedSlotData,
      SlotStatus.SlotDeletedSuccessfully
    );
  }
}
