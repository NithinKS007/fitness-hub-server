import { DeleteVideoPlaylistDTO } from "@application/dtos/playlist-dtos";
import { VideoPlaylist } from "@domain/entities/video-playlist.entity";
import { IVideoPlayListRepository } from "@domain/interfaces/IVideoPlayListRepository";
import VideoPlayListModel, {
  IVideoPlaylist,
} from "@infrastructure/databases/models/video-playlist.model";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";

export class VideoPlayListRepository
  extends BaseRepository<IVideoPlaylist, VideoPlaylist>
  implements IVideoPlayListRepository
{
  constructor(model: Model<IVideoPlaylist> = VideoPlayListModel) {
    super(model);
  }

  async deleteMany(deletePlayLists: DeleteVideoPlaylistDTO[]): Promise<void> {
    await this.model.deleteMany({ videoId: { $in: deletePlayLists } });
  }
}
