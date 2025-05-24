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

//MONGO REPOSITORY INSTANCES
const mongoPlayListRepository = new MongoPlayListRepository();

//USE CASE INSTANCES
const createPlayListUseCase = new CreatePlayListUseCase(
  mongoPlayListRepository
);

const editPlayListUseCase = new EditPlayListUseCase(mongoPlayListRepository);
const getallPlaylistUseCase = new GetallPlaylistUseCase(
  mongoPlayListRepository
);
const getPlayListUseCase = new GetPlayListUseCase(mongoPlayListRepository);
const updatePlayListPrivacyUseCase = new UpdatePlayListPrivacyUseCase(
  mongoPlayListRepository
);

export class PlayListController {
  static async addPlaylist(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { title } = req.body;
    const createdPlayList = await createPlayListUseCase.createPlayList({
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

  static async getPlaylists(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { playList, paginationData } = await getPlayListUseCase.getPlaylists(
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

  static async getallPlayLists(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId || req.user._id;
    const playListsOfTrainer = await getallPlaylistUseCase.getallPlaylists(
      trainerId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      playListsOfTrainer,
      PlayListStatus.PlayListsOfTrainerRetrievedSuccessfully
    );
  }

  static async updatePlayListPrivacy(
    req: Request,
    res: Response
  ): Promise<void> {
    const playListId = req.params.playListId;
    const { privacy } = req.body;
    const playListData =
      await updatePlayListPrivacyUseCase.updatePlayListPrivacy({
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

  static async editPlayList(req: Request, res: Response): Promise<void> {
    const { playListId } = req.params;
    const title = req.body.title;
    const updatedPlayListData = await editPlayListUseCase.editPlayList({
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
