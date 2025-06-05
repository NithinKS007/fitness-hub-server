import { Request, Response } from "express";
import {
  AppointmentStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";
import { GetAppointmentRequestUseCase } from "../../../application/usecases/appointment/get-appointment-req.usecase";
import { GetTrainerSchedulesUseCase } from "../../../application/usecases/appointment/get-trainer-schedules";
import { GetUserSchedulesUseCase } from "../../../application/usecases/appointment/get-user-schedules";

export class GetAppointmentController {
  constructor(
    private getAppointmentRequestUseCase: GetAppointmentRequestUseCase,
    private getTrainerSchedulesUseCase: GetTrainerSchedulesUseCase,
    private getUserSchedulesUseCase: GetUserSchedulesUseCase
  ) {}
  async handleGetBookingRequests(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { bookingRequestsList, paginationData } =
      await this.getAppointmentRequestUseCase.execute(trainerId, queryParams);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { bookingRequestsList, paginationData },
      AppointmentStatus.BookingRequestsRetrievedSuccessfully
    );
  }
  async handleGetTrainerSchedules(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { trainerBookingSchedulesList, paginationData } =
      await this.getTrainerSchedulesUseCase.execute(trainerId, queryParams);
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
  async handleGetUserSchedules(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { appointmentList, paginationData } =
      await this.getUserSchedulesUseCase.execute(userId, queryParams);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { appointmentList: appointmentList, paginationData: paginationData },
      AppointmentStatus.AppointmentsListRetrievedSuccessfully
    );
  }
}
