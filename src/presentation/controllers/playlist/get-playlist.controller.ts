import { Request, Response } from "express";
import {
  HttpStatusCodes,
  PlayListStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { GetallPlaylistUseCase } from "../../../application/usecases/playlist/get-all-playlist.usecase";
import { GetPlayListUseCase } from "../../../application/usecases/playlist/get-playlist.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class GetPlaylistController {
  constructor(
    private getallPlaylistUseCase: GetallPlaylistUseCase,
    private getPlayListUseCase: GetPlayListUseCase
  ) {}
  async getPlaylists(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { playList, paginationData } =
      await this.getPlayListUseCase.getPlaylists(trainerId, queryParams);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { playList: playList, paginationData: paginationData },
      PlayListStatus.PlayListsOfTrainerRetrievedSuccessfully
    );
  }

  async getallPlayLists(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId || req?.user?._id;
    const playListsOfTrainer = await this.getallPlaylistUseCase.getallPlaylists(
      trainerId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      playListsOfTrainer,
      PlayListStatus.PlayListsOfTrainerRetrievedSuccessfully
    );
  }
}
