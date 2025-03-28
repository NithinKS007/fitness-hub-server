import { CreatePlayListDTO } from "../../application/dtos/contentDTOs";
import { IdDTO } from "../../application/dtos/utilityDTOs";
import { Playlist } from "../entities/playListEntity";

export interface PlayListRepository {
    createPlayList(data:CreatePlayListDTO):Promise<Playlist>
    getAllPlayListsByTrainerId(data:IdDTO):Promise<Playlist[]>
    updateManyVideoCount(data:IdDTO[]):Promise<void>
}
