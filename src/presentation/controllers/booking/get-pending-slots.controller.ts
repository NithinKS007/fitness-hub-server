import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, SlotStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { GetPendingSlotsUseCase } from "@application/usecases/bookingSlot/get-pending-slots";
import { TYPES_BOOKINGSLOT_USECASAES } from "di/types-usecases";

@injectable()
export class GetPendingSlotsController {
  constructor(
    @inject(TYPES_BOOKINGSLOT_USECASAES.GetPendingSlotsUseCase)
    private getPendingSlotsUseCase: GetPendingSlotsUseCase
  ) {}

  async handleGetPendingSlots(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { availableSlotsList, paginationData } =
      await this.getPendingSlotsUseCase.execute(trainerId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      {
        availableSlotsList: availableSlotsList,
        paginationData: paginationData,
      },
      SlotStatus.SlotDataRetrievedSuccessfully
    );
  }
}
