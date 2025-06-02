import {
  BulkWriteAddVideoPlayListDTO,
  BulkWriteDeleteVideoPlayListDTO,
  CreateVideoPlayListDTO,
} from "../../../application/dtos/playlist-dtos";
import { VideoPlayList } from "../../../domain/entities/video-playlist.entities";
import { IVideoPlayListRepository } from "../../../domain/interfaces/IVideoPlayListRepository";
import videoPlayListModel from "../models/video-playlist.model";

export class VideoPlayListRepository implements IVideoPlayListRepository {
  async insertManyVideoPlayList(
    createVideoPlayList: CreateVideoPlayListDTO[]
  ): Promise<VideoPlayList[]> {
    return await videoPlayListModel.insertMany(createVideoPlayList);
  }

  async bulkWriteAddNewDeleteUnused(
    addPlayList: BulkWriteAddVideoPlayListDTO[],
    deletePlayList: BulkWriteDeleteVideoPlayListDTO[]
  ): Promise<void> {
    await videoPlayListModel.bulkWrite([
      {
        deleteMany: {
          filter: { videoId: { $in: deletePlayList } },
        },
      },
      ...addPlayList.map((playList) => ({
        insertOne: { document: playList },
      })),
    ]);
  }
}
