import { Request, Response } from "express";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetallPlaylistUseCase } from "@application/usecases/playlist/get-all-playlist.usecase";

export class GetAllPublicPlaylistController {
  constructor(private getallPlaylistUseCase: GetallPlaylistUseCase) {}

  async handleGetallPublicPlayLists(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId
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
