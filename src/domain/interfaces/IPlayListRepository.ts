import { CreatePlayListDTO, EditPlayList, UpdatePlayListBlockStatus } from "../../application/dtos/contentDTOs";
import { GetPlayListsQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { NumberOfVideoPerPlayList, Playlist } from "../entities/playListEntity";

export interface IPlayListRepository {
    createPlayList(createPlayListData:CreatePlayListDTO):Promise<Playlist>
    getTrainerPlaylists(trainerId:IdDTO,data:GetPlayListsQueryDTO):Promise<{playList:Playlist[],  paginationData:PaginationDTO}>
    getNumberOfVideosPerPlaylist(playListIds: IdDTO[]): Promise<NumberOfVideoPerPlayList[]> 
    updateManyVideoCount(numberOfVideosPerPlaylist:NumberOfVideoPerPlayList[]):Promise<void>
    updatePlayListBlockStatus(updatePlayListBlockStatus:UpdatePlayListBlockStatus):Promise<Playlist | null>
    getallTrainerPlaylists(trainerId:IdDTO):Promise<Playlist[]>
    editPlayList({playListId,title}:EditPlayList):Promise<Playlist | null>
}
