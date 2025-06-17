import { IPlayList } from "@domain/entities/playlist.entity";
import { IVideo } from "@domain/entities/video.entity";

interface VideoMetadata {
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  video: string;
}

export interface ReqCreateVideo extends VideoMetadata {
  trainerId: string;
  playLists: string[];
}

export interface VideosByPlayListIdDTO {
  playListId: string;
}

export interface UpdateVideoPrivacyDTO {
  videoId: string;
  privacy: boolean;
}

export interface ReqEditVideoDTO extends VideoMetadata {
  _id: string;
  trainerId: string;
  playLists: string[];
}

export interface VideoWithPlayLists extends IVideo {
  playLists: IPlayList[];
}
