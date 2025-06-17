import { Request, Response } from "express";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { CreateVideoUseCase } from "@application/usecases/video/create-video.usecase";

export class AddVideoController {
  constructor(private createVideoUseCase: CreateVideoUseCase) {}

  async handleAddVideo(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const createdVideo = await this.createVideoUseCase.execute({
      trainerId: trainerId,
      ...req.body,
    });

    sendResponse(res, StatusCodes.OK, createdVideo, VideoStatus.UploadSuccess);
  }
}
