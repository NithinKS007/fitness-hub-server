import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, SlotStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_BOOKINGSLOT_USECASAES } from "@di/types-usecases";
import { ICreateBookingSlotUC } from "@application/interfaces/usecases/ISlotUC";

@injectable()
export class CreateBookingSlotController {
  constructor(
    @inject(TYPES_BOOKINGSLOT_USECASAES.CreateBookingSlotUseCase)
    private createBookingSlot: ICreateBookingSlotUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};
    const bookingSlotData = {
      trainerId,
      ...req.body,
    };

    const createdSlotData = await this.createBookingSlot.execute(
      bookingSlotData
    );

    sendResponse(res, StatusCodes.Created, createdSlotData, SlotStatus.Created);
  }
}
