import { GetPlayListsQueryDTO } from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { IPlayList } from "../../infrastructure/databases/models/playlist.model";
import {
  NumberOfVideoPerPlayList,
  Playlist,
} from "../entities/playlist.entities";
import { IBaseRepository } from "./IBaseRepository";

export interface IPlayListRepository extends IBaseRepository<IPlayList> {
  getPlaylists(
    trainerId: string,
    data: GetPlayListsQueryDTO
  ): Promise<{ playList: Playlist[]; paginationData: PaginationDTO }>;
  getNumberOfVideosPerPlaylist(
    playListIds: string[]
  ): Promise<NumberOfVideoPerPlayList[]>;
  updateManyVideoCount(
    numberOfVideosPerPlaylist: NumberOfVideoPerPlayList[]
  ): Promise<void>;
  getallPlaylists(trainerId: string): Promise<Playlist[]>;
}
