import { Request, Response } from "express";
import {
  HttpStatusCodes,
  PlayListStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { EditPlayListUseCase } from "../../../application/usecases/playlist/edit-playlist.usecase";

export class EditPlaylistController {
  constructor(private editPlayListUseCase: EditPlayListUseCase) {}
  async editPlayList(req: Request, res: Response): Promise<void> {
    const updatePlayListData = {
      playListId: req.params.playListId,
      title: req.body.title,
    };
    const updatedPlayListData = await this.editPlayListUseCase.execute(
      updatePlayListData
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      updatedPlayListData,
      PlayListStatus.PlayListEditedSuccessfully
    );
  }
}
