import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_PLAYLIST_USECASES } from "@di/types-usecases";
import { IGetallPlaylistUC } from "@application/interfaces/usecases/IPlaylistUC";

@injectable()
export class GetAllPlaylistController {
  constructor(
    @inject(TYPES_PLAYLIST_USECASES.GetallPlaylistUseCase)
    private getallPlaylistUseCase: IGetallPlaylistUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const trainerPlaylists = await this.getallPlaylistUseCase.execute({
      trainerId,
    });

    sendResponse(
      res,
      StatusCodes.OK,
      trainerPlaylists,
      PlayListStatus.RetrievedSuccess
    );
  }
}
