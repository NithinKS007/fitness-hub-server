import { DeleteVideoPlaylistDTO } from "@application/dtos/playlist-dtos";
import { VideoPlaylist } from "@domain/entities/video-playlist.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface IVideoPlayListRepository
  extends IBaseRepository<VideoPlaylist> {
  deleteMany(deletePlayLists: DeleteVideoPlaylistDTO[]): Promise<void>;
}
