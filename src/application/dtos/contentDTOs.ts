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

export interface TrainerVideosByPlayListDTO {
  playListId: string;
}
