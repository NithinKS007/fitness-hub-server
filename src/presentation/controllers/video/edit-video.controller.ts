import { Request, Response } from "express";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { EditVideoUseCase } from "@application/usecases/video/edit-video.usecase";

export class EditVideoController {
  constructor(private editVideoUseCase: EditVideoUseCase) {}
  async handleEditVideo(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;
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
