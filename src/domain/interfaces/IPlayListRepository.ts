import { CreatePlayListDTO, UpdatePlayListBlockStatus } from "../../application/dtos/contentDTOs";
import { GetPlayListsQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { Playlist } from "../entities/playListEntity";

export interface IPlayListRepository {
    createPlayList(createPlayListData:CreatePlayListDTO):Promise<Playlist>
    getAllPlayListsByTrainerId(trainerId:IdDTO,data:GetPlayListsQueryDTO):Promise<{playList:Playlist[],  paginationData:PaginationDTO}>
    updateManyVideoCount(playListIds:IdDTO[]):Promise<void>
    updatePlayListBlockStatus(updatePlayListBlockStatus:UpdatePlayListBlockStatus):Promise<Playlist | null>
    getFullPlayListsOfTrainer(trainerId:IdDTO):Promise<Playlist[]>
}
