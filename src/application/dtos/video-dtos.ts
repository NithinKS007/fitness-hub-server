import { PlayList } from "@domain/entities/playlist.entity";
import { Video } from "@domain/entities/video.entity";

interface VideoMetadata {
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  video: string;
}

export interface GetVideoDetails {
  videoId: string;
  trainerId: string;
  privacy?: boolean;
}

export interface CreateVideo extends VideoMetadata {
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

export interface EditVideoDTO extends VideoMetadata {
  _id: string;
  trainerId: string;
  playLists: string[];
}

export interface VideoWithPlayLists extends Video {
  playLists: PlayList[];
}
