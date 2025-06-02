import { Request, Response } from "express";
import {
  HttpStatusCodes,
  VideoStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { EditVideoUseCase } from "../../../application/usecases/video/edit-video.usecase";

export class EditVideoController {
  constructor(private editVideoUseCase: EditVideoUseCase) {}
  async editVideo(req: Request, res: Response): Promise<void> {
    const videoId = req.params.videoId;
    const trainerId = req?.user?._id;
    const updatedVideoData = {
      trainerId,
      _id: videoId,
      ...req.body,
    };
    const editedVideoData = await this.editVideoUseCase.editVideo(
      updatedVideoData
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      editedVideoData,
      VideoStatus.videoEditedSuccessfully
    );
  }
}
