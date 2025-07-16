import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { BlockStatus, StatusCodes } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_PLAYLIST_USECASES } from "@di/types-usecases";
import { IUpdatePlayListPrivacyUC } from "@application/interfaces/usecases/IPlaylistUC";

@injectable()
export class UpdatePlaylistPrivacyController {
  constructor(
    @inject(TYPES_PLAYLIST_USECASES.UpdatePlayListPrivacyUseCase)
    private updatePlayListPrivacyUseCase: IUpdatePlayListPrivacyUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id:playListId } = req.params;
    const { privacy } = req.body;

    const privacyData = {
      playListId,
      privacy,
    };

    const playListData = await this.updatePlayListPrivacyUseCase.execute(
      privacyData
    );

    sendResponse(
      res,
      StatusCodes.OK,
      playListData,
      BlockStatus.StatusUpdateFailed
    );
  }
}
