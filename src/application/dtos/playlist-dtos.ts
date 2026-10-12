
export interface CreatePlayListDTO {
  trainerId: string;
  title: string;
}
export interface CreateVideoPlayList {
  videoId: string;
  playListId: string;
}

export interface DeleteVideoPlaylistDTO {
  videoId: string;
}

export interface UpdatePlayListPrivacyDTO {
  playListId: string;
  privacy: boolean;
}
export interface EditPlayListDTO {
  playListId: string;
  title: string;
}

export interface VideoPerPlayList {
  playListId: string;
  videoCount: number;
}
