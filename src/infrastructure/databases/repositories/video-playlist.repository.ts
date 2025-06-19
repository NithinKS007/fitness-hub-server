import { DeleteVideoPlaylistDTO } from "@application/dtos/playlist-dtos";
import { IVideoPlaylist } from "@domain/entities/video-playlist.entity";
import { IVideoPlayListRepository } from "@domain/interfaces/IVideoPlayListRepository";
import VideoPlayListModel from "@infrastructure/databases/models/video-playlist.model";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";

export class VideoPlayListRepository
  extends BaseRepository<IVideoPlaylist>
  implements IVideoPlayListRepository
{
  constructor(model: Model<IVideoPlaylist> = VideoPlayListModel) {
    super(model);
  }

  async deleteMany(deletePlayLists: DeleteVideoPlaylistDTO[]): Promise<void> {
    await this.model.deleteMany({ videoId: { $in: deletePlayLists } });
  }
}
