import { ReqEditVideoDTO } from "@application/dtos/video-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  VideoStatus,
} from "@shared/constants/index.constants";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { IVideoRepository } from "@domain/interfaces/IVideoRepository";
import { IVideoPlayListRepository } from "@domain/interfaces/IVideoPlayListRepository";
import { IVideo } from "@domain/entities/video.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

/**
 * Purpose: Edit a video by updating its details, such as description, duration, playlists, thumbnail, and title.
 * Incoming: { _id, description, duration, playLists, thumbnail, title, trainerId, video } -
 * All the video details that need to be updated.
 * Returns: The updated video object containing all the modified video data.
 * Throws: validationError if any required field is missing or if the update operation fails.
 */

@injectable()
export class EditVideoUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.PlayListRepository)
    private playListRepository: IPlayListRepository,
    @inject(TYPES_REPOSITORIES.VideoRepository)
    private videoRepository: IVideoRepository,
    @inject(TYPES_REPOSITORIES.VideoPlayListRepository)
    private videoPlayListRepository: IVideoPlayListRepository
  ) {}

  async execute({
    _id,
    description,
    duration,
    playLists,
    thumbnail,
    title,
    trainerId,
    video,
  }: ReqEditVideoDTO): Promise<IVideo> {
    if (
      !_id ||
      !description ||
      !duration ||
      !playLists ||
      !thumbnail ||
      !title ||
      !trainerId ||
      !video
    ) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    const videoData = await this.videoRepository.findById(_id);

    if (!videoData) {
      throw new validationError(VideoStatus.VideoNotFound);
    }
    const existingNameExcludingId = await this.videoRepository.findOne({
      title,
      _id: videoData?._id,
    });

    if (existingNameExcludingId) {
      throw new validationError(VideoStatus.NameExists);
    }
    const editedVideo = await this.videoRepository.update(_id, {
      description,
      duration,
      thumbnail,
      title,
      trainerId,
      video,
    });

    if (!editedVideo) {
      throw new validationError(VideoStatus.EditFail);
    }

    if (editedVideo && playLists && playLists.length > 0) {
      const videoPlayListDocs = playLists.map((list) => ({
        videoId: editedVideo._id.toString(),
        playListId: list,
      }));

      const videoIdsToDelete = videoPlayListDocs.map((list) => list.videoId);
      const videoCountWithPlayList =
        await this.playListRepository.getPlaylistCounts(playLists);

      await Promise.all([
        this.videoPlayListRepository.insertMany(
          videoPlayListDocs as unknown as any
        ),
        this.videoPlayListRepository.deleteMany(videoIdsToDelete),
      ]);

      if (videoCountWithPlayList.length > 0) {
        await this.playListRepository.updateVideosCount(videoCountWithPlayList);
      }
    }

    return editedVideo;
  }
}
