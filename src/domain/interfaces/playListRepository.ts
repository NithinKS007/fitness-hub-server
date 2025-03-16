import { CreatePlayList, IdDTO } from "../../application/dtos";
import { Playlist } from "../entities/playListEntity";

export interface PlayListRepository {
    createPlayList(data:CreatePlayList):Promise<Playlist>
    getAllPlayListsByTrainerId(data:IdDTO):Promise<Playlist[]>
}
