import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_VIDEO_USECASES } from "@di/types-usecases";
import { IGetVideosUC } from "@application/interfaces/usecases/IVideoUC";

@injectable()
export class GetPublicVideosController {
  constructor(
    @inject(TYPES_VIDEO_USECASES.GetVideosUseCase)
    private getVideosUseCase: IGetVideosUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: trainerId } = req.params;

    const queryParams = parseQueryParams(req.query);

    const videoPrivacy = false;
    const playlistPrivacy = false;

    const { videoList, paginationData } = await this.getVideosUseCase.execute({
      trainerId,
      videoPrivacy,
      playlistPrivacy,
      ...queryParams,
    });

    sendResponse(
      res,
      StatusCodes.OK,
      { videoList: videoList, paginationData: paginationData },
      VideoStatus.FetchSuccess
    );
  }
}
