import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { GetAppointmentRequestUseCase } from "@application/usecases/appointment/get-appointment-request.usecase";
import { TYPES_APPOINTMENT_USECASES } from "@di/types-usecases";

@injectable()
export class GetBookingRequestsController {
  constructor(
    @inject(TYPES_APPOINTMENT_USECASES.GetAppointmentRequestUseCase)
    private getAppointmentRequestUseCase: GetAppointmentRequestUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { bookingRequestsList, paginationData } =
      await this.getAppointmentRequestUseCase.execute(trainerId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { bookingRequestsList, paginationData },
      AppointmentStatus.BookingRequestsRetrieved
    );
  }
}
