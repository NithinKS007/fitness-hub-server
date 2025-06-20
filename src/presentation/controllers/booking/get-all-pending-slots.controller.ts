import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, SlotStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetAllPendingSlotsUseCase } from "@application/usecases/bookingSlot/get-all-pending-slots";
import { TYPES_BOOKINGSLOT_USECASAES } from "di/types-usecases";

@injectable()
export class GetAllPendingSlotsController {
  constructor(
    @inject(TYPES_BOOKINGSLOT_USECASAES.GetAllPendingSlotsUseCase)
    private getAllPendingSlotsUseCase: GetAllPendingSlotsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { trainerId } = req.params;

    const bookingSlotsOfTrainer = await this.getAllPendingSlotsUseCase.execute(
      trainerId
    );

    sendResponse(
      res,
      StatusCodes.OK,
      bookingSlotsOfTrainer,
      SlotStatus.SlotDataRetrievedSuccessfully
    );
  }
}
