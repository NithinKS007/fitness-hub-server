import { Request, Response } from "express";
import {
  HttpStatusCodes,
  VideoStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { CreateVideoUseCase } from "../../../application/usecases/video/create-video.usecase";

export class AddVideoController {
  constructor(private createVideoUseCase: CreateVideoUseCase) {}
  async addVideo(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const createdVideo = await this.createVideoUseCase.createVideo({
      trainerId: trainerId,
      ...req.body,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      createdVideo,
      VideoStatus.VideoUploadedSuccessfully
    );
  }
}
