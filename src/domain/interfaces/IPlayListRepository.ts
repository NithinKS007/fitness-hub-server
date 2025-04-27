import {
  CreatePlayListDTO,
  EditPlayListDTO,
  UpdatePlayListPrivacyDTO,
} from "../../application/dtos/playListDTOs";
import { GetPlayListsQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
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
