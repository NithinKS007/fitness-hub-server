import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetPlayListUseCase } from "@application/usecases/playlist/get-playlist.usecase";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_PLAYLIST_USECASES } from "di/types-usecases";

@injectable()
export class GetPlaylistController {
  constructor(
    @inject(TYPES_PLAYLIST_USECASES.GetPlayListUseCase)
    private getPlayListUseCase: GetPlayListUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { playList, paginationData } = await this.getPlayListUseCase.execute(
      trainerId,
      queryParams
    );

    sendResponse(
      res,
      StatusCodes.OK,
      { playList: playList, paginationData: paginationData },
      PlayListStatus.RetrievedSuccess
    );
  }
}
