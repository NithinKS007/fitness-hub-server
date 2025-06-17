import { Request, Response } from "express";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse.queryParams";
import { GetAppointmentRequestUseCase } from "@application/usecases/appointment/get-appointment-request.usecase";

export class GetBookingRequestsController {
  constructor(
    private getAppointmentRequestUseCase: GetAppointmentRequestUseCase
  ) {}

  async handleGetBookingRequests(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { bookingRequestsList, paginationData } =
      await this.getAppointmentRequestUseCase.execute(trainerId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { bookingRequestsList, paginationData },
      AppointmentStatus.BookingRequestsRetrievedSuccessfully
    );
  }
}
