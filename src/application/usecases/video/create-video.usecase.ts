import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { IVideoRepository } from "@domain/interfaces/IVideoRepository";
import { IVideoPlayListRepository } from "@domain/interfaces/IVideoPlayListRepository";
import {
  ApplicationStatus,
  VideoStatus,
} from "@shared/constants/index.constants";
import { ReqCreateVideo } from "@application/dtos/video-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IVideo } from "@domain/entities/video.entity";

/**
 * Purpose: Handles the logic for creating a new video, including saving video details and managing
 * its playlist associations.
 * Incoming: { video, description, duration, playLists, thumbnail, title, trainerId } -
 * All the video details and associated playlists.
 * Returns: The newly created video object along with its playlist associations.
 * Throws: validationError if any required fields are missing.
 */

export class CreateVideoUseCase {
  constructor(
    private playListRepository: IPlayListRepository,
    private videoRepository: IVideoRepository,
    private videoPlayListRepository: IVideoPlayListRepository
  ) {}

  async execute({
    video,
    description,
    duration,
    playLists,
    thumbnail,
    title,
    trainerId,
  }: ReqCreateVideo): Promise<IVideo> {
    if (
      !video ||
      !description ||
      !duration ||
      !playLists ||
      !thumbnail ||
      !title ||
      !trainerId
    ) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const videoData = {
      video,
      description,
      duration,
      thumbnail,
      title,
      trainerId,
    };
    const existingName = await this.videoRepository.findOne({ title: title });

    if (existingName) {
      throw new validationError(VideoStatus.NameExists);
    }
    
    const createdVideo = await this.videoRepository.create(videoData);

    if (createdVideo && playLists && playLists.length > 0) {
      const playlistEntries = playLists.map((list) => ({
        videoId: createdVideo._id.toString(),
        playListId: list,
      }));

      const [_, playlistVideoCounts] = await Promise.all([
        this.videoPlayListRepository.insertMany(playlistEntries),
        this.playListRepository.getPlaylistCounts(playLists),
      ]);

      if (playlistVideoCounts.length > 0) {
        await this.playListRepository.updateManyVideoCount(playlistVideoCounts);
      }
    }
    return createdVideo;
  }
}
