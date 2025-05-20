import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";
import { IVideoRepository } from "../../../domain/interfaces/IVideoRepository";
import { IVideoPlayListRepository } from "../../../domain/interfaces/IVideoPlayListRepository";
import { AuthStatus } from "../../../shared/constants/index-constants";
import { CreateVideoDTO } from "../../dtos/video-dtos";
import { Video } from "../../../domain/entities/video";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";

export class CreateVideoUseCase {
  constructor(
    private playListRepository: IPlayListRepository,
    private videoRepository: IVideoRepository,
    private videoPlayListRepository: IVideoPlayListRepository
  ) {}

  public async createdVideo({
    video,
    description,
    duration,
    playLists,
    thumbnail,
    title,
    trainerId,
  }: CreateVideoDTO): Promise<Video> {
    if (
      !video ||
      !description ||
      !duration ||
      !playLists ||
      !thumbnail ||
      !title ||
      !trainerId
    ) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }
    const createdVideo = await this.videoRepository.createVideo({
      video,
      description,
      duration,
      playLists,
      thumbnail,
      title,
      trainerId,
    });

    if (createdVideo && playLists && playLists.length > 0) {
      const videoPlayListDocs = playLists.map((list) => ({
        videoId: createdVideo._id.toString(),
        playListId: list,
      }));

      await this.videoPlayListRepository.insertManyVideoPlayList(
        videoPlayListDocs
      );

      const videoCountWithPlayList =
        await this.playListRepository.getNumberOfVideosPerPlaylist(playLists);

      if (videoCountWithPlayList.length > 0) {
        await this.playListRepository.updateManyVideoCount(
          videoCountWithPlayList
        );
      }
    }
    return createdVideo;
  }
}
