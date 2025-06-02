import {
  CreatePlayListDTO,
  EditPlayListDTO,
  UpdatePlayListPrivacyDTO,
} from "../../application/dtos/playlist-dtos";
import { GetPlayListsQueryDTO } from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { NumberOfVideoPerPlayList, Playlist } from "../entities/playlist.entities";

export interface IPlayListRepository {
  addPlaylist(createPlayListData: CreatePlayListDTO): Promise<Playlist>;
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
  updatePrivacy(
    updatePlayListBlockStatus: UpdatePlayListPrivacyDTO
  ): Promise<Playlist | null>;
  getallPlaylists(trainerId: string): Promise<Playlist[]>;
  editPlayList({ playListId, title }: EditPlayListDTO): Promise<Playlist | null>;
}
