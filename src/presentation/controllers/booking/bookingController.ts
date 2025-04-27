import { NextFunction, Request, Response } from "express";
import {
  HttpStatusCodes,
  SlotStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { MongoBookingSlotRepository } from "../../../infrastructure/databases/repositories/bookingSlotRepository";
import { LoggerService } from "../../../infrastructure/logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";
import { CreateBookingSlotUseCase } from "../../../application/usecases/bookingSlot/createBookingSlotUseCase";
import { DeleteBookingSlotUseCase } from "../../../application/usecases/bookingSlot/deleteBookingSlotUseCase";
import { GetBookingSlotUseCase } from "../../../application/usecases/bookingSlot/getBookingSlotUseCase";

//MONGO REPOSITORY INSTANCES
const mongoBookingSlotRepository = new MongoBookingSlotRepository();

//SERVICE INSTANCES
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

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
  static async addBookingSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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
        SlotStatusMessage.SlotCreatedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "BookingController.addBookingSlot",
        "Error creating slot"
      );
      next(error);
    }
  }

  static async deleteBookingSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const bookingSlotId = req.params.bookingSlotId;
      const deletedSlotData = await deleteBookingSlotUseCase.deleteBookingSlot(
        bookingSlotId
      );
      sendResponse(
        res,
        HttpStatusCodes.OK,
        deletedSlotData,
        SlotStatusMessage.SlotDeletedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "BookingController.deleteBookingSlot",
        "Error deleting slot"
      );
      next(error);
    }
  }

  static async getAvailableSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { fromDate, toDate, page, limit } = req.query;
      const { availableSlotsList, paginationData } =
        await getBookingSlotUseCase.getAvailableSlotsTrainer(trainerId, {
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
        SlotStatusMessage.SlotDataRetrievedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "BookingController.getAvailableSlots",
        "Error retrieving available slot details"
      );
      next(error);
    }
  }

  static async getTrainerBookingSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.params.trainerId;
      const bookingSlotsOfTrainer =
        await getBookingSlotUseCase.getAvailableSlotsUser(trainerId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        bookingSlotsOfTrainer,
        SlotStatusMessage.SlotDataRetrievedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "BookingController.getTrainerBookingSlots",
        "Error retrieving slot list of trainer"
      );
      next(error);
    }
  }
}
