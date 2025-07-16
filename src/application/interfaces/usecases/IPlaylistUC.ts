import { IBaseUseCase } from "./IBase.UC";
import { GetPlayListsQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import {
  CreatePlayListDTO,
  EditPlayListDTO,
  UpdatePlayListPrivacyDTO,
} from "@application/dtos/playlist-dtos";
import { PlayList } from "@domain/entities/playlist.entity";

export interface ICreatePlayListUC
  extends IBaseUseCase<CreatePlayListDTO, PlayList> {}

export interface IEditPlayListUC
  extends IBaseUseCase<EditPlayListDTO, PlayList> {}

export interface IGetallPlaylistUC
  extends IBaseUseCase<
    {
      trainerId: string;
      privacy?: boolean;
    },
    PlayList[]
  > {}

export interface IGetPlayListUC
  extends IBaseUseCase<
    GetPlayListsQueryDTO,
    { playList: PlayList[]; paginationData: PaginationDTO }
  > {}

export interface IUpdatePlayListPrivacyUC
  extends IBaseUseCase<UpdatePlayListPrivacyDTO, PlayList> {}
