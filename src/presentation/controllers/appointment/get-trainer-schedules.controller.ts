import { Request, Response } from "express";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse.queryParams";
import { GetTrainerSchedulesUseCase } from "@application/usecases/appointment/get-trainer-schedules";

export class GetTrainerSchedulesController {
  constructor(private getTrainerSchedulesUseCase: GetTrainerSchedulesUseCase) {}

  async handleGetTrainerSchedules(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { trainerBookingSchedulesList, paginationData } =
      await this.getTrainerSchedulesUseCase.execute(trainerId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      {
        trainerBookingSchedulesList: trainerBookingSchedulesList,
        paginationData: paginationData,
      },
      AppointmentStatus.AppointmentsListRetrievedSuccessfully
    );
  }
}
