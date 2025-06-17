import {
  CreateVideoPlayList,
  DeleteVideoPlaylistDTO,
} from "@application/dtos/playlist-dtos";
import { IVideoPlaylist } from "@domain/entities/video-playlist.entity";

export interface IVideoPlayListRepository {
  insertMany(
    createVideoPlayList: CreateVideoPlayList[]
  ): Promise<IVideoPlaylist[]>;
  deleteMany(deletePlayLists: DeleteVideoPlaylistDTO[]): Promise<void>;
}
