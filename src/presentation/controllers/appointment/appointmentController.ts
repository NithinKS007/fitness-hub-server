import { Request, Response } from "express";
import {
  AppointmentStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index-constants";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { MongoBookingSlotRepository } from "../../../infrastructure/databases/repositories/bookingSlotRepository";
import { MongoAppointmentRepository } from "../../../infrastructure/databases/repositories/appointmentRepository";
import { BookAppointmentUseCase } from "../../../application/usecases/appointment/bookAppointmentUseCaste";
import { UpdateAppointmentUseCase } from "../../../application/usecases/appointment/updateAppointmentUseCase";
import { GetAppointmentUsecase } from "../../../application/usecases/appointment/getAppointmentUseCase";

//MONGO REPOSITORY INSTANCES
const mongoBookingSlotRepository = new MongoBookingSlotRepository();
const mongoAppointmentRepository = new MongoAppointmentRepository();

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
  static async cancelAppointment(req: Request, res: Response): Promise<void> {
    const appointmentId = req.params.appointmentId;
    const cancelledAppointmentData =
      await updateAppointmentUseCase.cancelAppointment(appointmentId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      cancelledAppointmentData,
      AppointmentStatus.AppointmentCancelledSuccessfully
    );
  }

  static async getTrainerBookingSchedules(
    req: Request,
    res: Response
  ): Promise<void> {
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
      AppointmentStatus.AppointmentsListRetrievedSuccessfully
    );
  }
  static async handleBookingRequest(
    req: Request,
    res: Response
  ): Promise<void> {
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
        AppointmentStatus.BookingApproved
      );
    } else if (appointmentData.status === "rejected") {
      sendResponse(
        res,
        HttpStatusCodes.OK,
        appointmentData,
        AppointmentStatus.BookingRejected
      );
    }
  }

  static async getBookingRequests(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
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
      AppointmentStatus.BookingRequestsRetrievedSuccessfully
    );
  }

  static async bookAppointment(req: Request, res: Response): Promise<void> {
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
      AppointmentStatus.SlotBookedSuccessfully
    );
  }

  static async getUserBookingSchedules(
    req: Request,
    res: Response
  ): Promise<void> {
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
      AppointmentStatus.AppointmentsListRetrievedSuccessfully
    );
  }
}
