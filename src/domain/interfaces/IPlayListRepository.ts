import {
  CreatePlayListDTO,
  EditPlayListDTO,
  UpdatePlayListPrivacyDTO,
} from "../../application/dtos/playlist-dtos";
import { GetPlayListsQueryDTO } from "../../application/dtos/query-dtos";
import { IdDTO, PaginationDTO } from "../../application/dtos/utility-dtos";
import { NumberOfVideoPerPlayList, Playlist } from "../entities/playList";

export interface IPlayListRepository {
  createPlayList(createPlayListData: CreatePlayListDTO): Promise<Playlist>;
  getPlaylists(
    trainerId: IdDTO,
    data: GetPlayListsQueryDTO
  ): Promise<{ playList: Playlist[]; paginationData: PaginationDTO }>;
  getNumberOfVideosPerPlaylist(
    playListIds: IdDTO[]
  ): Promise<NumberOfVideoPerPlayList[]>;
  updateManyVideoCount(
    numberOfVideosPerPlaylist: NumberOfVideoPerPlayList[]
  ): Promise<void>;
  updatePlayListPrivacy(
    updatePlayListBlockStatus: UpdatePlayListPrivacyDTO
  ): Promise<Playlist | null>;
  getallPlaylists(trainerId: IdDTO): Promise<Playlist[]>;
  editPlayList({ playListId, title }: EditPlayListDTO): Promise<Playlist | null>;
}
