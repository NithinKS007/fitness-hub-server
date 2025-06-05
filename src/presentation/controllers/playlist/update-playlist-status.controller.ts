import { Request, Response } from "express";
import {
  BlockStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { UpdatePlayListPrivacyUseCase } from "../../../application/usecases/playlist/update-playlist-privacy.usecase";

export class UpdatePlaylistcontroller {
  constructor(
    private updatePlayListPrivacyUseCase: UpdatePlayListPrivacyUseCase
  ) {}
  async updatePrivacy(req: Request, res: Response): Promise<void> {
    const privacyData = {
      playListId: req.params.playListId,
      privacy: req.body.privacy,
    };
    const playListData = await this.updatePlayListPrivacyUseCase.execute(
      privacyData
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      playListData,
      BlockStatus.BlockStatusUpdated
    );
  }
}
