import { Request, Response } from "express";
import { StatusCodes, SlotStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse.queryParams";
import { GetUpComingSlotsUseCase } from "@application/usecases/bookingSlot/get-upcoming-slots";

export class GetUpComingSlotsController {
  constructor(private getUpComingSlotsUseCase: GetUpComingSlotsUseCase) {}

  async handleGetUpcomingSlots(req: Request, res: Response): Promise<void> {
    const { trainerId } = req.params;

    const queryParams = parseQueryParams(req.query);

    const { availableSlotsList, paginationData } =
      await this.getUpComingSlotsUseCase.execute(trainerId, queryParams);

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
