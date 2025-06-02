import { Request, Response } from "express";
import {
  HttpStatusCodes,
  SlotStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { DeleteBookingSlotUseCase } from "../../../application/usecases/bookingSlot/delete-booking-slot.usecase";

export class DeleteBookingSlotController {
  constructor(private deleteBookingSlotUseCase: DeleteBookingSlotUseCase) {}
  async deleteBookingSlot(req: Request, res: Response): Promise<void> {
    const bookingSlotId = req.params.bookingSlotId;
    const deletedSlotData =
      await this.deleteBookingSlotUseCase.deleteBookingSlot(bookingSlotId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      deletedSlotData,
      SlotStatus.SlotDeletedSuccessfully
    );
  }
}
