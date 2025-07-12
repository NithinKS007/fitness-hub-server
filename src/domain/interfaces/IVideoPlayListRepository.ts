import { DeleteVideoPlaylistDTO } from "@application/dtos/playlist-dtos";
import { VideoPlaylist } from "@domain/entities/video-playlist.entity";
import { IBaseRepository } from "./IBaseRepository";
import { IVideoPlaylist } from "@infrastructure/databases/models/video-playlist.model";

export interface IVideoPlayListRepository
  extends IBaseRepository<IVideoPlaylist,VideoPlaylist> {
  deleteMany(deletePlayLists: DeleteVideoPlaylistDTO[]): Promise<void>;
}
