import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetallPlaylistUseCase } from "@application/usecases/playlist/get-all-playlist.usecase";
import { TYPES_PLAYLIST_USECASES } from "di/types-usecases";

@injectable()
export class GetAllPlaylistController {
  constructor(
    @inject(TYPES_PLAYLIST_USECASES.GetallPlaylistUseCase)
    private getallPlaylistUseCase: GetallPlaylistUseCase
  ) {}

  async handleGetallPlayLists(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const trainerPlaylists = await this.getallPlaylistUseCase.execute(
      trainerId
    );

    sendResponse(
      res,
      StatusCodes.OK,
      trainerPlaylists,
      PlayListStatus.RetrievedSuccess
    );
  }
}
