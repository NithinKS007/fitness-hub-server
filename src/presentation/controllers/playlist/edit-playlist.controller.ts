import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, PlayListStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { EditPlayListUseCase } from "@application/usecases/playlist/edit-playlist.usecase";
import { TYPES_PLAYLIST_USECASES } from "@di/types-usecases";

@injectable()
export class EditPlaylistController {
  constructor(
    @inject(TYPES_PLAYLIST_USECASES.EditPlayListUseCase)
    private editPlayListUseCase: EditPlayListUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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
