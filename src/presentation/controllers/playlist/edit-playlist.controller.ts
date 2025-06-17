import { Request, Response } from "express";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { EditPlayListUseCase } from "@application/usecases/playlist/edit-playlist.usecase";

export class EditPlaylistController {
  constructor(private editPlayListUseCase: EditPlayListUseCase) {}
  async handleEditPlayList(req: Request, res: Response): Promise<void> {
    const { playListId } = req.params;
    const { title } = req.body;

    const updatePlayListData = { playListId, title };

    const updatedPlayListData = await this.editPlayListUseCase.execute(
      updatePlayListData
    );

    sendResponse(
      res,
      StatusCodes.OK,
      updatedPlayListData,
      PlayListStatus.EditedSuccess
    );
  }
}
