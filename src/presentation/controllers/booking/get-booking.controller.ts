import { Request, Response } from "express";
import {
  HttpStatusCodes,
  SlotStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { GetBookingSlotUseCase } from "../../../application/usecases/bookingSlot/get-booking-slot.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class GetBookingSlotController {
  constructor(private getBookingSlotUseCase: GetBookingSlotUseCase) {}
  async getAvailableSlots(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { availableSlotsList, paginationData } =
      await this.getBookingSlotUseCase.getAvailableSlots(
        trainerId,
        queryParams
      );
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
      await this.getBookingSlotUseCase.getUpcomingSlots(trainerId, queryParams);
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
    const bookingSlotsOfTrainer =
      await this.getBookingSlotUseCase.getAllAvailableSlots(trainerId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      bookingSlotsOfTrainer,
      SlotStatus.SlotDataRetrievedSuccessfully
    );
  }
}
