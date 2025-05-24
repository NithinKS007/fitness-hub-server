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

//MONGO REPOSITORY INSTANCES
const mongoBookingSlotRepository = new MongoBookingSlotRepository();

//USE CASE INSTANCES
const createBookingSlotUseCase = new CreateBookingSlotUseCase(
  mongoBookingSlotRepository
);
const deleteBookingSlotUseCase = new DeleteBookingSlotUseCase(
  mongoBookingSlotRepository
);
const getBookingSlotUseCase = new GetBookingSlotUseCase(
  mongoBookingSlotRepository
);

export class BookingController {
  static async addBookingSlot(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const slotData = req.body;
    const createdSlotData = await createBookingSlotUseCase.addBookingSlot({
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

  static async deleteBookingSlot(req: Request, res: Response): Promise<void> {
    const bookingSlotId = req.params.bookingSlotId;
    const deletedSlotData = await deleteBookingSlotUseCase.deleteBookingSlot(
      bookingSlotId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      deletedSlotData,
      SlotStatus.SlotDeletedSuccessfully
    );
  }

  static async getAvailableSlots(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit } = req.query;
    const { availableSlotsList, paginationData } =
      await getBookingSlotUseCase.getAvailableSlots(trainerId, {
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

  static async getAvailableSlotsFromToday(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.params.trainerId;
    const { fromDate, toDate, page, limit } = req.query;
    const { availableSlotsList, paginationData } =
      await getBookingSlotUseCase.getAvailableSlotsFromToday(trainerId, {
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

  static async getAllAvailableSlotsFromToday(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.params.trainerId;
    const bookingSlotsOfTrainer =
      await getBookingSlotUseCase.getAllAvailableSlotsFromToday(trainerId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      bookingSlotsOfTrainer,
      SlotStatus.SlotDataRetrievedSuccessfully
    );
  }
}
