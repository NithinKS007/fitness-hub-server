import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { BlockStatus, StatusCodes } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { UpdatePlayListPrivacyUseCase } from "@application/usecases/playlist/update-playlist-privacy.usecase";
import { TYPES_PLAYLIST_USECASES } from "di/types-usecases";

@injectable()
export class UpdatePlaylistPrivacyController {
  constructor(
    @inject(TYPES_PLAYLIST_USECASES.UpdatePlayListPrivacyUseCase)
    private updatePlayListPrivacyUseCase: UpdatePlayListPrivacyUseCase
  ) {}

  async handleUpdatePrivacy(req: Request, res: Response): Promise<void> {
    const { playListId } = req.params;
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
