import { User } from "@domain/entities/user.entity";
import { IBaseUseCase } from "./IBase.UC";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { GetUsersDTO } from "@application/dtos/query-dtos";
import { UpdateBlockStatusDTO } from "@application/dtos/auth-dtos";
import { Trainer } from "@domain/entities/trainer.entity";

export interface IGetUserDetailsUC
  extends IBaseUseCase<string, User | (User & { trainerDetails: Trainer })> {}
export interface IGetUsersUC
  extends IBaseUseCase<
    GetUsersDTO,
    {
      usersList: User[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IUpdateUserBlockStatusUC
  extends IBaseUseCase<UpdateBlockStatusDTO, User> {}
