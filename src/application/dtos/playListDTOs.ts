export interface CreatePlayListDTO {
  trainerId: string;
  title: string;
}
export interface CreateVideoPlayListDTO {
  videoId: string;
  playListId: string;
}
export interface BulkWriteAddVideoPlayListDTO {
  videoId: string;
  playListId: string;
}
export type BulkWriteDeleteVideoPlayListDTO = string;
export interface UpdatePlayListPrivacyDTO {
  playListId: string;
  privacy: boolean;
}
export interface EditPlayListDTO {
  playListId: string;
  title: string;
}
