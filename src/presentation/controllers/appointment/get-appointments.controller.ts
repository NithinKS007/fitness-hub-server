import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppointmentStatus, StatusCodes } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_APPOINTMENT_USECASES } from "@di/types-usecases";
import {
  IGetAppointmentRequestsUC,
  IGetUserSchedulesUC,
} from "@application/interfaces/usecases/IAppointmentUC";
import { IGetTrainerSchedulesUC } from "@application/interfaces/usecases/IAppointmentUC";

@injectable()
export class GetAppointmentsController {
  constructor(
    @inject(TYPES_APPOINTMENT_USECASES.GetUserSchedulesUseCase)
    private getUserSchedulesUC: IGetUserSchedulesUC,
    @inject(TYPES_APPOINTMENT_USECASES.GetTrainerSchedulesUseCase)
    private getTrainerSchedulesUC: IGetTrainerSchedulesUC,
    @inject(TYPES_APPOINTMENT_USECASES.GetAppointmentRequestUseCase)
    private getAppointmentRequestUC: IGetAppointmentRequestsUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id, role } = req.user || {};
    const queryParams = parseQueryParams(req.query);
    const status = queryParams.status;

    let responseData;

    if (
      role === "user" &&
      typeof status === "object" &&
      !Array.isArray(status) &&
      status["approved"]
    ) {
      const { appointmentList, paginationData } =
        await this.getUserSchedulesUC.execute({ userId: id, ...queryParams });

      responseData = { appointmentList, paginationData };
    } else if (
      role === "trainer" &&
      typeof status === "object" &&
      !Array.isArray(status) &&
      status["approved"]
    ) {
      const { trainerBookingSchedulesList, paginationData } =
        await this.getTrainerSchedulesUC.execute({
          trainerId: id,
          ...queryParams,
        });

      responseData = {
        appointmentList: trainerBookingSchedulesList,
        paginationData,
      };
    } else if (
      role === "trainer" &&
      typeof status === "object" &&
      !Array.isArray(status) &&
      status["pending"]
    ) {
      const { bookingRequestsList, paginationData } =
        await this.getAppointmentRequestUC.execute({
          trainerId: id,
          ...queryParams,
        });

      responseData = {
        appointmentList: bookingRequestsList,
        paginationData,
      };

      sendResponse(
        res,
        StatusCodes.OK,
        responseData,
        AppointmentStatus.BookingRequestsRetrieved
      );
      return;
    } else {
      sendResponse(
        res,
        StatusCodes.Forbidden,
        null,
        "Unauthorized or unsupported role/status"
      );
      return;
    }

    sendResponse(
      res,
      StatusCodes.OK,
      responseData,
      AppointmentStatus.AppointmentsFetched
    );
  }
}
