import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { GetTrainerSchedulesUseCase } from "@application/usecases/appointment/get-trainer-schedules";
import { TYPES_APPOINTMENT_USECASES } from "di/types-usecases";

@injectable()
export class GetTrainerSchedulesController {
  constructor(
    @inject(TYPES_APPOINTMENT_USECASES.GetTrainerSchedulesUseCase)
    private getTrainerSchedulesUseCase: GetTrainerSchedulesUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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
