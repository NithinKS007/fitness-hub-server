import { Request, Response } from "express";
import {
  BlockStatus,
  HttpStatusCodes,
  PlayListStatus,
} from "../../../shared/constants/index-constants";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { MongoPlayListRepository } from "../../../infrastructure/databases/repositories/playListRepository";
import { CreatePlayListUseCase } from "../../../application/usecases/playlist/createPlayListUseCase";
import { EditPlayListUseCase } from "../../../application/usecases/playlist/editPlayListUseCase";
import { GetallPlaylistUseCase } from "../../../application/usecases/playlist/getAllPlayListUseCase";
import { GetPlayListUseCase } from "../../../application/usecases/playlist/getPlayListUseCase";
import { UpdatePlayListPrivacyUseCase } from "../../../application/usecases/playlist/updatePlayListPrivacyUseCase";


export class PlayListController {
  constructor(
    private createPlayListUseCase: CreatePlayListUseCase,
    private editPlayListUseCase: EditPlayListUseCase,
    private getallPlaylistUseCase: GetallPlaylistUseCase,
    private getPlayListUseCase: GetPlayListUseCase,
    private updatePlayListPrivacyUseCase: UpdatePlayListPrivacyUseCase
  ) {}

  public async addPlaylist(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { title } = req.body;
    const createdPlayList = await this.createPlayListUseCase.createPlayList({
      trainerId: trainerId,
      title,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      createdPlayList,
      PlayListStatus.PlayListCreated
    );
  }

  public async getPlaylists(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { playList, paginationData } = await this.getPlayListUseCase.getPlaylists(
      trainerId,
      {
        fromDate: fromDate as any,
        toDate: toDate as any,
        page: page as string,
        limit: limit as string,
        search: search as string,
        filters: filters as string[],
      }
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { playList: playList, paginationData: paginationData },
      PlayListStatus.PlayListsOfTrainerRetrievedSuccessfully
    );
  }

  public async getallPlayLists(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId || req.user._id;
    const playListsOfTrainer = await this.getallPlaylistUseCase.getallPlaylists(
      trainerId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      playListsOfTrainer,
      PlayListStatus.PlayListsOfTrainerRetrievedSuccessfully
    );
  }

  public async updatePlayListPrivacy(
    req: Request,
    res: Response
  ): Promise<void> {
    const playListId = req.params.playListId;
    const { privacy } = req.body;
    const playListData =
      await this.updatePlayListPrivacyUseCase.updatePlayListPrivacy({
        playListId,
        privacy,
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      playListData,
      BlockStatus.BlockStatusUpdated
    );
  }

  public async editPlayList(req: Request, res: Response): Promise<void> {
    const { playListId } = req.params;
    const title = req.body.title;
    const updatedPlayListData = await this.editPlayListUseCase.editPlayList({
      playListId,
      title,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      updatedPlayListData,
      PlayListStatus.PlayListEditedSuccessfully
    );
  }
}
