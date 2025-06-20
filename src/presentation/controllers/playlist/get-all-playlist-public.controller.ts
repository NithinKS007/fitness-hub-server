import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetallPlaylistUseCase } from "@application/usecases/playlist/get-all-playlist.usecase";
import { TYPES_PLAYLIST_USECASES } from "di/types-usecases";

@injectable()
export class GetAllPublicPlaylistController {
  constructor(
    @inject(TYPES_PLAYLIST_USECASES.GetallPlaylistUseCase)
    private getallPlaylistUseCase: GetallPlaylistUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { trainerId } = req.params;
    const privacy = false;
    const playListsOfTrainer = await this.getallPlaylistUseCase.execute(
      trainerId,
      privacy
    );

    sendResponse(
      res,
      StatusCodes.OK,
      playListsOfTrainer,
      PlayListStatus.RetrievedSuccess
    );
  }
}
