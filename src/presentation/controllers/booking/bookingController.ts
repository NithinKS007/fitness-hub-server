import { Request, Response } from "express";
import {
  HttpStatusCodes,
  SlotStatus,
} from "../../../shared/constants/index-constants";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { MongoBookingSlotRepository } from "../../../infrastructure/databases/repositories/bookingSlotRepository";
import { CreateBookingSlotUseCase } from "../../../application/usecases/bookingSlot/createBookingSlotUseCase";
import { DeleteBookingSlotUseCase } from "../../../application/usecases/bookingSlot/deleteBookingSlotUseCase";
import { GetBookingSlotUseCase } from "../../../application/usecases/bookingSlot/getBookingSlotUseCase";



export class BookingController {
  constructor(
    private createBookingSlotUseCase: CreateBookingSlotUseCase,
    private deleteBookingSlotUseCase: DeleteBookingSlotUseCase,
    private getBookingSlotUseCase: GetBookingSlotUseCase
  ) {}

  public async addBookingSlot(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const slotData = req.body;
    const createdSlotData = await this.createBookingSlotUseCase.addBookingSlot({
      trainerId: trainerId,
      ...slotData,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      createdSlotData,
      SlotStatus.SlotCreatedSuccessfully
    );
  }

  public async deleteBookingSlot(req: Request, res: Response): Promise<void> {
    const bookingSlotId = req.params.bookingSlotId;
    const deletedSlotData = await this.deleteBookingSlotUseCase.deleteBookingSlot(
      bookingSlotId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      deletedSlotData,
      SlotStatus.SlotDeletedSuccessfully
    );
  }

  public async getAvailableSlots(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit } = req.query;
    const { availableSlotsList, paginationData } =
      await this.getBookingSlotUseCase.getAvailableSlots(trainerId, {
        fromDate: fromDate as any,
        toDate: toDate as any,
        page: page as string,
        limit: limit as string,
      });
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

  public async getAvailableSlotsFromToday(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.params.trainerId;
    const { fromDate, toDate, page, limit } = req.query;
    const { availableSlotsList, paginationData } =
      await this.getBookingSlotUseCase.getAvailableSlotsFromToday(trainerId, {
        fromDate: fromDate as any,
        toDate: toDate as any,
        page: page as string,
        limit: limit as string,
      });
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

  public async getAllAvailableSlotsFromToday(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.params.trainerId;
    const bookingSlotsOfTrainer =
      await this.getBookingSlotUseCase.getAllAvailableSlotsFromToday(trainerId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      bookingSlotsOfTrainer,
      SlotStatus.SlotDataRetrievedSuccessfully
    );
  }
}
