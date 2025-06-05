import { Request, Response } from "express";
import {
  HttpStatusCodes,
  SlotStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";
import { GetPendingSlotsUseCase } from "../../../application/usecases/bookingSlot/get-pending-slots";
import { GetAllPendingSlotsUseCase } from "../../../application/usecases/bookingSlot/get-all-pending-slots";
import { GetUpComingSlotsUseCase } from "../../../application/usecases/bookingSlot/get-upcoming-slots";

export class GetBookingSlotController {
  constructor(
    private getPendingSlotsUseCase: GetPendingSlotsUseCase,
    private getAllPendingSlotsUseCase: GetAllPendingSlotsUseCase,
    private getUpComingSlotsUseCase: GetUpComingSlotsUseCase
  ) {}
  async getAvailableSlots(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { availableSlotsList, paginationData } =
      await this.getPendingSlotsUseCase.execute(trainerId, queryParams);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      {
        availableSlotsList: availableSlotsList,
        paginationData: paginationData,
      },
      SlotStatus.SlotDataRetrievedSuccessfully
    );
  }

  async getUpcomingSlots(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId;
    const queryParams = parseQueryParams(req.query);
    const { availableSlotsList, paginationData } =
      await this.getUpComingSlotsUseCase.execute(trainerId, queryParams);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      {
        availableSlotsList: availableSlotsList,
        paginationData: paginationData,
      },
      SlotStatus.SlotDataRetrievedSuccessfully
    );
  }

  async getAllAvailableSlots(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId;
    const bookingSlotsOfTrainer = await this.getAllPendingSlotsUseCase.execute(
      trainerId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      bookingSlotsOfTrainer,
      SlotStatus.SlotDataRetrievedSuccessfully
    );
  }
}
