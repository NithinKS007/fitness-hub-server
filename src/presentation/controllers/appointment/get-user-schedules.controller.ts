import { Request, Response } from "express";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse.queryParams";
import { GetUserSchedulesUseCase } from "@application/usecases/appointment/get-user-schedules";

export class GetUserSchedulescontroller {
  constructor(private getUserSchedulesUseCase: GetUserSchedulesUseCase) {}

  async handleGetUserSchedules(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { appointmentList, paginationData } =
      await this.getUserSchedulesUseCase.execute(userId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { appointmentList: appointmentList, paginationData: paginationData },
      AppointmentStatus.AppointmentsListRetrievedSuccessfully
    );
  }
}
