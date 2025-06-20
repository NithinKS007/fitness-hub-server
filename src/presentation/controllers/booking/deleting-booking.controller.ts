import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, SlotStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { DeleteBookingSlotUseCase } from "@application/usecases/bookingSlot/delete-booking-slot.usecase";
import { TYPES_BOOKINGSLOT_USECASAES } from "di/types-usecases";

@injectable()
export class DeleteBookingSlotController {
  constructor(
    @inject(TYPES_BOOKINGSLOT_USECASAES.DeleteBookingSlotUseCase)
    private deleteBookingSlotUseCase: DeleteBookingSlotUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { bookingSlotId } = req.params;

    const deletedSlotData = await this.deleteBookingSlotUseCase.execute(
      bookingSlotId
    );

    sendResponse(res, StatusCodes.OK, deletedSlotData, SlotStatus.Deleted);
  }
}
