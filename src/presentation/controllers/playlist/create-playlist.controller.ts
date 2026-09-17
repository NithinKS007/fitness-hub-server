import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_PLAYLIST_USECASES } from "@di/types-usecases";
import { ICreatePlayListUC } from "@application/interfaces/usecases/IPlaylistUC";

@injectable()
export class CreatePlaylistController {
  constructor(
    @inject(TYPES_PLAYLIST_USECASES.CreatePlayListUseCase)
    private createPlayListUseCase: ICreatePlayListUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};
    const { title } = req.body;

    const createdData = {
      trainerId,
      title,
    };

    const createdPlayList = await this.createPlayListUseCase.execute(
      createdData
    );
    sendResponse(
      res,
      StatusCodes.Created,
      createdPlayList,
      PlayListStatus.Created
    );
  }
}
