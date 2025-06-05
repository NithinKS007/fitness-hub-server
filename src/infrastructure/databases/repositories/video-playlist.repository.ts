import {
  BulkWriteAddVideoPlayListDTO,
  BulkWriteDeleteVideoPlayListDTO,
  CreateVideoPlayListDTO,
} from "../../../application/dtos/playlist-dtos";
import { VideoPlayList } from "../../../domain/entities/video-playlist.entities";
import { IVideoPlayListRepository } from "../../../domain/interfaces/IVideoPlayListRepository";
import VideoPlayListModel from "../models/video-playlist.model";

export class VideoPlayListRepository implements IVideoPlayListRepository {
  async insertPlaylists(
    createVideoPlayList: CreateVideoPlayListDTO[]
  ): Promise<VideoPlayList[]> {
    return await VideoPlayListModel.insertMany(createVideoPlayList);
  }

  async bulkUpdatePlaylists(
    addPlayList: BulkWriteAddVideoPlayListDTO[],
    deletePlayList: BulkWriteDeleteVideoPlayListDTO[]
  ): Promise<void> {
    await VideoPlayListModel.bulkWrite([
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
