import { Request, Response } from "express";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetallPlaylistUseCase } from "@application/usecases/playlist/get-all-playlist.usecase";

export class GetAllPlaylistController {
  constructor(private getallPlaylistUseCase: GetallPlaylistUseCase) {}

  async handleGetallPlayLists(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;

    const playListsOfTrainer = await this.getallPlaylistUseCase.execute(
      trainerId
    );

    sendResponse(
      res,
      StatusCodes.OK,
      playListsOfTrainer,
      PlayListStatus.RetrievedSuccess
    );
  }
}
