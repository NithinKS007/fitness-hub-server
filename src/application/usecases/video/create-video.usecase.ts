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
        videoId: String(createdVideo._id),
        playListId: list,
      }));

      const [_, playlistVideoCounts] = await Promise.all([
        this.videoPlayListRepository.insertMany(
          playlistEntries as unknown as any
        ),
        this.playListRepository.getPlaylistCounts(playLists),
      ]);

      if (playlistVideoCounts.length > 0) {
        await this.playListRepository.updateVideosCount(playlistVideoCounts);
      }
    }
    return createdVideo;
  }
}
