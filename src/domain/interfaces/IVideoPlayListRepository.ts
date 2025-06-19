import { DeleteVideoPlaylistDTO } from "@application/dtos/playlist-dtos";
import { IVideoPlaylist } from "@domain/entities/video-playlist.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface IVideoPlayListRepository
  extends IBaseRepository<IVideoPlaylist> {
  deleteMany(deletePlayLists: DeleteVideoPlaylistDTO[]): Promise<void>;
}
