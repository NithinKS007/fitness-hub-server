import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, SlotStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_BOOKINGSLOT_USECASAES } from "@di/types-usecases";
import { IGetSlotsUC } from "@application/interfaces/usecases/ISlotUC";

@injectable()
export class GetUpComingSlotsController {
  constructor(
    @inject(TYPES_BOOKINGSLOT_USECASAES.GetSlotsUseCase)
    private getUpComingSlotsUseCase: IGetSlotsUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: trainerId } = req.params;

    const queryParams = parseQueryParams(req.query);

    const { availableSlotsList, paginationData } =
      await this.getUpComingSlotsUseCase.execute({
        trainerId,
        ...queryParams,
        type: "upcoming",
      });

    sendResponse(
      res,
      StatusCodes.OK,
      {
        availableSlotsList: availableSlotsList,
        paginationData: paginationData,
        view: queryParams.view,
      },
      SlotStatus.RetrievedSuccess
    );
  }
}
