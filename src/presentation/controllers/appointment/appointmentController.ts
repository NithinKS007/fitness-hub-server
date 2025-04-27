import { NextFunction, Request, Response } from "express";
import {
  AppointmentStatusMessage,
  HttpStatusCodes,
} from "../../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { MongoBookingSlotRepository } from "../../../infrastructure/databases/repositories/bookingSlotRepository";
import { MongoAppointmentRepository } from "../../../infrastructure/databases/repositories/appointmentRepository";
import { LoggerService } from "../../../infrastructure/logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";
import { BookAppointmentUseCase } from "../../../application/usecases/appointment/bookAppointmentUseCaste";
import { UpdateAppointmentUseCase } from "../../../application/usecases/appointment/updateAppointmentUseCase";
import { GetAppointmentUsecase } from "../../../application/usecases/appointment/getAppointmentUseCase";

//MONGO REPOSITORY INSTANCES
const mongoBookingSlotRepository = new MongoBookingSlotRepository();
const mongoAppointmentRepository = new MongoAppointmentRepository();

//SERVICE INSTANCES
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

//USE CASE INSTANCES
const bookAppointmentUseCase = new BookAppointmentUseCase(
  mongoBookingSlotRepository,
  mongoAppointmentRepository
);

const updateAppointmentUseCase = new UpdateAppointmentUseCase(
  mongoBookingSlotRepository,
  mongoAppointmentRepository
);

const getAppointmentUseCase = new GetAppointmentUsecase(
  mongoAppointmentRepository
);


export class AppointmentController {
  static async cancelAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const appointmentId = req.params.appointmentId;
      const cancelledAppointmentData =
        await updateAppointmentUseCase.cancelAppointment(appointmentId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        cancelledAppointmentData,
        AppointmentStatusMessage.AppointmentCancelledSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "AppointmentController.cancelAppointment",
        "Error cancelling appointment"
      );
      next(error);
    }
  }

  static async getTrainerBookingSchedules(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { fromDate, toDate, page, limit, search, filters } = req.query;
      const { trainerBookingSchedulesList, paginationData } =
        await getAppointmentUseCase.getTrainerBookingSchedules(trainerId, {
          fromDate: fromDate as any,
          toDate: toDate as any,
          page: page as string,
          limit: limit as string,
          search: search as string,
          filters: filters as string[],
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        {
          trainerBookingSchedulesList: trainerBookingSchedulesList,
          paginationData: paginationData,
        },
        AppointmentStatusMessage.AppointmentsListRetrievedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "AppointmentController.getTrainerBookingSchedules",
        "Error retrieving booking schedules for trainer"
      );
      next(error);
    }
  }
  static async handleBookingRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { appointmentId, bookingSlotId, action } = req.body;
      const appointmentData =
        await updateAppointmentUseCase.approveOrRejectBooking({
          appointmentId,
          bookingSlotId,
          action,
        });
      if (appointmentData.status === "approved") {
        sendResponse(
          res,
          HttpStatusCodes.OK,
          appointmentData,
          AppointmentStatusMessage.BookingApproved
        );
      } else if (appointmentData.status === "rejected") {
        sendResponse(
          res,
          HttpStatusCodes.OK,
          appointmentData,
          AppointmentStatusMessage.BookingRejected
        );
      }
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "AppointmentController.handleBookingRequest",
        "Error changing booking status"
      );
      next(error);
    }
  }

  static async getBookingRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { fromDate, toDate, page, limit, search, filters } = req.query
      const { bookingRequestsList, paginationData } =
        await getAppointmentUseCase.getBookingRequests(trainerId, {
          fromDate: fromDate as any,
          toDate: toDate as any,
          page: page as string,
          limit: limit as string,
          search: search as string,
          filters: filters as string[],
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { bookingRequestsList, paginationData },
        AppointmentStatusMessage.BookingRequestsRetrievedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "AppointmentController.getBookingRequests",
        "Error retrieving booking requests"
      );
      next(error);
    }
  }

  static async bookAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const slotId = req.params.slotId;
      const { _id } = req.user;
      const bookedSlotData = await bookAppointmentUseCase.bookSlotAppointment({
        slotId,
        userId: _id,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        bookedSlotData,
        AppointmentStatusMessage.SlotBookedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "AppointmentController.bookAppointment",
        "Error booking slot"
      );
      next(error);
    }
  }

  static async getUserBookingSchedules(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const { fromDate, toDate, page, limit, search, filters } = req.query;
      const { appointmentList, paginationData } =
        await getAppointmentUseCase.getUserBookingSchedules(userId, {
          fromDate: fromDate as any,
          toDate: toDate as any,
          page: page as string,
          limit: limit as string,
          search: search as string,
          filters: filters as string[],
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { appointmentList: appointmentList, paginationData: paginationData },
        AppointmentStatusMessage.AppointmentsListRetrievedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "AppointmentController.getUserBookingSchedules",
        "Error retrieving appointments for user"
      );
      next(error);
    }
  }
}
