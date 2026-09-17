import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_VIDEO_USECASES } from "@di/types-usecases";
import { IEditVideoUC } from "@application/interfaces/usecases/IVideoUC";

@injectable()
export class EditVideoController {
  constructor(
    @inject(TYPES_VIDEO_USECASES.EditVideoUseCase)
    private editVideoUseCase: IEditVideoUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: videoId } = req.params;
    const { _id: trainerId } = req?.user || {};

    const updatedVideoData = {
      trainerId,
      _id: videoId,
      ...req.body,
    };

    const editedVideoData = await this.editVideoUseCase.execute(
      updatedVideoData
    );

    sendResponse(res, StatusCodes.OK, editedVideoData, VideoStatus.EditSuccess);
  }
}
