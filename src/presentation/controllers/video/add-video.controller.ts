import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_VIDEO_USECASES } from "@di/types-usecases";
import { ICreateVideoUC } from "@application/interfaces/usecases/IVideoUC";

@injectable()
export class AddVideoController {
  constructor(
    @inject(TYPES_VIDEO_USECASES.CreateVideoUseCase)
    private createVideoUseCase: ICreateVideoUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const createdVideo = await this.createVideoUseCase.execute({
      trainerId: trainerId,
      ...req.body,
    });

    sendResponse(
      res,
      StatusCodes.Created,
      createdVideo,
      VideoStatus.UploadSuccess
    );
  }
}
