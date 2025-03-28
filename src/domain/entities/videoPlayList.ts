import { ObjectId } from "mongoose";

export interface VideoPlayList {
    videoId:ObjectId | string
    playListId:ObjectId | string
}