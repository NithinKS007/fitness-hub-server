import { ObjectId } from "mongoose";

export interface CreatePlayListDTO {
  trainerId: string;
  title: string;
}
export interface CreateVideoPlayList {
  videoId: string;
  playListId: string;
}

export type DeleteVideoPlaylistDTO = string;

export interface UpdatePlayListPrivacyDTO {
  playListId: string;
  privacy: boolean;
}
export interface EditPlayListDTO {
  playListId: string;
  title: string;
}

export interface VideoPerPlayList {
  playListId: ObjectId;
  videoCount: number;
}
