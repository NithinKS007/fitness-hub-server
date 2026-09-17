import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_PLAYLIST_USECASES } from "@di/types-usecases";
import { IGetallPlaylistUC } from "@application/interfaces/usecases/IPlaylistUC";

@injectable()
export class GetAllPublicPlaylistController {
  constructor(
    @inject(TYPES_PLAYLIST_USECASES.GetallPlaylistUseCase)
    private getallPlaylistUseCase: IGetallPlaylistUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: trainerId } = req.params;
    const privacy = false;
    const playListsOfTrainer = await this.getallPlaylistUseCase.execute({
      trainerId,
      privacy,
    });

    sendResponse(
      res,
      StatusCodes.OK,
      playListsOfTrainer,
      PlayListStatus.RetrievedSuccess
    );
  }
}
