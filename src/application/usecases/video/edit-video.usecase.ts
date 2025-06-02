import { EditVideoDTO } from "../../dtos/video-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  VideoStatus,
} from "../../../shared/constants/index.constants";
import { Video } from "../../../domain/entities/video.entities";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";
import { IVideoRepository } from "../../../domain/interfaces/IVideoRepository";
import { IVideoPlayListRepository } from "../../../domain/interfaces/IVideoPlayListRepository";

export class EditVideoUseCase {
  constructor(
    private playListRepository: IPlayListRepository,
    private videoRepository: IVideoRepository,
    private videoPlayListRepository: IVideoPlayListRepository
  ) {}

  async editVideo({
    _id,
    description,
    duration,
    playLists,
    thumbnail,
    title,
    trainerId,
    video,
  }: EditVideoDTO): Promise<Video> {
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
    const editedVideo = await this.videoRepository.editVideo({
      _id,
      description,
      duration,
      playLists,
      thumbnail,
      title,
      trainerId,
      video,
    });

    if (!editedVideo) {
      throw new validationError(VideoStatus.FailedToEditVideo);
    }

    if (editedVideo && playLists && playLists.length > 0) {
      const videoPlayListDocs = playLists.map((list) => ({
        videoId: editedVideo._id.toString(),
        playListId: list,
      }));

      const videoIdsToDelete = videoPlayListDocs.map((list) => list.videoId);
      const videoCountWithPlayList =
        await this.playListRepository.getNumberOfVideosPerPlaylist(playLists);

      await this.videoPlayListRepository.bulkWriteAddNewDeleteUnused(
        videoPlayListDocs,
        videoIdsToDelete
      );
      if (videoCountWithPlayList.length > 0) {
        await this.playListRepository.updateManyVideoCount(
          videoCountWithPlayList
        );
      }
    }

    return editedVideo;
  }
}
