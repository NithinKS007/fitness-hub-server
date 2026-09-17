import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  AppointmentStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_APPOINTMENT_USECASES } from "@di/types-usecases";
import { IGetUserSchedulesUC } from "@application/interfaces/usecases/IAppointmentUC";

@injectable()
export class GetUserSchedulesController {
  constructor(
    @inject(TYPES_APPOINTMENT_USECASES.GetUserSchedulesUseCase)
    private getUserSchedulesUC: IGetUserSchedulesUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { appointmentList, paginationData } =
      await this.getUserSchedulesUC.execute({ userId, ...queryParams });

    sendResponse(
      res,
      StatusCodes.OK,
      { appointmentList: appointmentList, paginationData: paginationData },
      AppointmentStatus.AppointmentsFetched
    );
  }
}
