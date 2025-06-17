import {
  CreateVideoPlayList,
  DeleteVideoPlaylistDTO,
} from "@application/dtos/playlist-dtos";
import { IVideoPlaylist } from "@domain/entities/video-playlist.entity";
import { IVideoPlayListRepository } from "@domain/interfaces/IVideoPlayListRepository";
import VideoPlayListModel from "@infrastructure/databases/models/video-playlist.model";

export class VideoPlayListRepository implements IVideoPlayListRepository {
  async insertMany(
    createVideoPlayList: CreateVideoPlayList[]
  ): Promise<IVideoPlaylist[]> {
    return await VideoPlayListModel.insertMany(createVideoPlayList);
  }

  async deleteMany(deletePlayLists: DeleteVideoPlaylistDTO[]): Promise<void> {
    await VideoPlayListModel.deleteMany({ videoId: { $in: deletePlayLists } });
  }
}
