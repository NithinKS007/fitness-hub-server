export interface CreatePlayListDTO {
  trainerId: string;
  title: string;
}

export interface CreatedVideoDTO {
  trainerId: string;
  title: string;
  description: string;
  duration: Number;
  thumbnail: string;
  video: string;
  playLists: string[];
}

export interface CreateVideoPlayListDTO {
  videoId: string;
  playListId: string;
}

export interface BulkWriteAddVideoPlayListDTO {
  videoId: string;
  playListId: string;
}
export type BulkWriteDeleteVideoPlayListDTO = string
export interface TrainerVideosByPlayListDTO {
  playListId: string;
}

export interface UpdateVideoBlockStatus {
  videoId: string;
  privacy: boolean;
}
export interface UpdatePlayListBlockStatus {
  playListId: string;
  privacy: boolean;
}

export interface EditVideo {
  _id: string;
  trainerId: string;
  title: string;
  description: string;
  duration: Number;
  thumbnail: string;
  video: string;
  playLists: string[];
}
