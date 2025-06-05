export interface ReqCreateVideo {
  trainerId: string;
  title: string;
  description: string;
  duration: Number;
  thumbnail: string;
  video: string;
  playLists: string[];
}

export interface VideosByPlayListIdDTO {
  playListId: string;
}

export interface UpdateVideoPrivacyDTO {
  videoId: string;
  privacy: boolean;
}

export interface ReqEditVideoDTO {
  _id: string;
  trainerId: string;
  title: string;
  description: string;
  duration: Number;
  thumbnail: string;
  video: string;
  playLists: string[];
}
