import { Request, Response } from "express";
import {
  AppointmentStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index-constants";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { BookAppointmentUseCase } from "../../../application/usecases/appointment/bookAppointmentUseCaste";
import { UpdateAppointmentUseCase } from "../../../application/usecases/appointment/updateAppointmentUseCase";
import { GetAppointmentUsecase } from "../../../application/usecases/appointment/getAppointmentUseCase";

export class AppointmentController {
  constructor(
    private bookAppointmentUseCase: BookAppointmentUseCase,
    private updateAppointmentUseCase: UpdateAppointmentUseCase,
    private getAppointmentUseCase: GetAppointmentUsecase
  ) {}
  public async cancelAppointment(req: Request, res: Response): Promise<void> {
    const appointmentId = req.params.appointmentId;
    const cancelledAppointmentData =
      await this.updateAppointmentUseCase.cancelAppointment(appointmentId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      cancelledAppointmentData,
      AppointmentStatus.AppointmentCancelledSuccessfully
    );
  }

  public async getTrainerBookingSchedules(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { trainerBookingSchedulesList, paginationData } =
      await this.getAppointmentUseCase.getTrainerBookingSchedules(trainerId, {
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
  public async handleBookingRequest(
    req: Request,
    res: Response
  ): Promise<void> {
    const { appointmentId, bookingSlotId, action } = req.body;
    const appointmentData =
      await this.updateAppointmentUseCase.approveOrRejectBooking({
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

  public async getBookingRequests(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { bookingRequestsList, paginationData } =
      await this.getAppointmentUseCase.getBookingRequests(trainerId, {
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

  public async bookAppointment(req: Request, res: Response): Promise<void> {
    const slotId = req.params.slotId;
    const { _id } = req.user;
    const bookedSlotData = await this.bookAppointmentUseCase.bookSlotAppointment({
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

  public async getUserBookingSchedules(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { appointmentList, paginationData } =
      await this.getAppointmentUseCase.getUserBookingSchedules(userId, {
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
