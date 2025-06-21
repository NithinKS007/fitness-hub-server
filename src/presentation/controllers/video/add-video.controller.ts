import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { CreateVideoUseCase } from "@application/usecases/video/create-video.usecase";
import { TYPES_VIDEO_USECASES } from "@di/types-usecases";

@injectable()
export class AddVideoController {
  constructor(
    @inject(TYPES_VIDEO_USECASES.CreateVideoUseCase)
    private createVideoUseCase: CreateVideoUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const createdVideo = await this.createVideoUseCase.execute({
      trainerId: trainerId,
      ...req.body,
    });

    sendResponse(res, StatusCodes.OK, createdVideo, VideoStatus.UploadSuccess);
  }
}
