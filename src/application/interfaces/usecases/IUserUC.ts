import { User } from "@domain/entities/user.entity";
import { IBaseUseCase } from "./IBase.UC";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { GetUsersQueryDTO } from "@application/dtos/query-dtos";
import { UpdateBlockStatusDTO } from "@application/dtos/auth-dtos";

export interface IGetUserDetailsUC extends IBaseUseCase<string, User> {}
export interface IGetUsersUC
  extends IBaseUseCase<
    GetUsersQueryDTO,
    {
      usersList: User[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IUpdateUserBlockStatusUC
  extends IBaseUseCase<UpdateBlockStatusDTO, User> {}
