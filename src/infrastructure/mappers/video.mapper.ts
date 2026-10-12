import { ObjectId } from "mongoose";
import { BaseMapper } from "./BaseMapper";

interface BaseVideo {
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  video: string;
  privacy: boolean;
}

interface BasePlayList {
  title: string;
  videoCount: number;
  privacy: boolean;
}

interface PlayListDBLayer extends BasePlayList {
  _id: ObjectId;
  trainerId: ObjectId;
}
interface PlayListUILayer extends BasePlayList {
  id: string;
  trainerId: string;
}

interface VideoDBLayer extends BaseVideo {
  _id: ObjectId;
  trainerId: ObjectId;
  playLists: PlayListDBLayer[];
}

export interface VideoUILayer extends BaseVideo {
  id: string;
  trainerId: string;
  playLists: PlayListUILayer[];
}

export class VideoMapper extends BaseMapper<VideoDBLayer, VideoUILayer> {
  mapToDomain(data: VideoDBLayer): VideoUILayer {
    return {
      id: this.mapToString(data._id),
      trainerId: this.mapToString(data.trainerId),
      title: data.title,
      description: data.description,
      duration: data.duration,
      thumbnail: data.thumbnail,
      video: data.video,
      privacy: data.privacy,
      playLists: data.playLists.map((data) => ({
        id: this.mapToString(data._id),
        trainerId: this.mapToString(data.trainerId),
        title: data.title,
        videoCount: data.videoCount,
        privacy: data.privacy,
      })),
    };
  }

  map(data: VideoDBLayer): VideoUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}
