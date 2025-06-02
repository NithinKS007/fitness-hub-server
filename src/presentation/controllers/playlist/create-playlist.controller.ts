import { Request, Response } from "express";
import {
  HttpStatusCodes,
  PlayListStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { CreatePlayListUseCase } from "../../../application/usecases/playlist/create-playlist.usecase";

export class CreatePlaylistController {
  constructor(private createPlayListUseCase: CreatePlayListUseCase) {}
  async addPlaylist(req: Request, res: Response): Promise<void> {
    const newPlayListData = {
      trainerId: req?.user?._id,
      title: req.body.title,
    };
    const createdPlayList = await this.createPlayListUseCase.addPlaylist(
      newPlayListData
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      createdPlayList,
      PlayListStatus.PlayListCreated
    );
  }
}
