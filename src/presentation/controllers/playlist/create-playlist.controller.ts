import { Request, Response } from "express";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { CreatePlayListUseCase } from "@application/usecases/playlist/create-playlist.usecase";

export class CreatePlaylistController {
  constructor(private createPlayListUseCase: CreatePlayListUseCase) {}

  async handleAddPlaylist(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};
    const { title } = req.body;

    const createdData = {
      trainerId,
      title,
    };

    const createdPlayList = await this.createPlayListUseCase.execute(
      createdData
    );
    sendResponse(res, StatusCodes.OK, createdPlayList, PlayListStatus.Created);
  }
}
