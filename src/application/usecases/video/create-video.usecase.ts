import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { IVideoRepository } from "@domain/interfaces/IVideoRepository";
import { IVideoPlayListRepository } from "@domain/interfaces/IVideoPlayListRepository";
import {
  ApplicationStatus,
  VideoStatus,
} from "@shared/constants/index.constants";
import { CreateVideo } from "@application/dtos/video-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { Video } from "@domain/entities/video.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

/**
 * Purpose: Handles the logic for creating a new video, including saving video details and managing
 * its playlist associations.
 * Incoming: { video, description, duration, playLists, thumbnail, title, trainerId } -
 * All the video details and associated playlists.
 * Returns: The newly created video object along with its playlist associations.
 * Throws: validationError if any required fields are missing.
 */

@injectable()
export class CreateVideoUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.PlayListRepository)
    private playListRepository: IPlayListRepository,
    @inject(TYPES_REPOSITORIES.VideoRepository)
    private videoRepository: IVideoRepository,
    @inject(TYPES_REPOSITORIES.VideoPlayListRepository)
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
  }: CreateVideo): Promise<Video> {
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
        videoId: String(createdVideo._id),
        playListId: list,
      }));

      await this.videoPlayListRepository.insertMany(playlistEntries as any);

      const playlistVideoCounts =
        await this.playListRepository.getPlaylistCounts(playLists);

      if (playlistVideoCounts.length > 0) {
        await this.playListRepository.updateVideosCount(playlistVideoCounts);
      }
    }
    return createdVideo;
  }
}
