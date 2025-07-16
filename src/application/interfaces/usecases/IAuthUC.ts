import { IBaseUseCase } from "./IBase.UC";
import {
  ChangePasswordDTO,
  CreatePassResetTokenDTO,
  GoogleTokenDTO,
  OtpDTO,
  PasswordResetDTO,
  SignInDTO,
} from "@application/dtos/auth-dtos";
import {
  CreateTrainerDTO,
  TrainerDTO,
  UpdateTrainerDetailsDTO,
} from "@application/dtos/trainer-dtos";
import { User } from "@domain/entities/user.entity";
import {
  CreateUserDTO,
  UpdateUserDetailsDTO,
} from "@application/dtos/user-dtos";
import { PasswordResetToken } from "@domain/entities/pass-reset-token.entity";
import { Otp } from "@domain/entities/otp.entity";
import { JwtPayload } from "jsonwebtoken";

export interface IChangePasswordUC
  extends IBaseUseCase<ChangePasswordDTO, void> {}

export interface ICheckUserBlockStatusUC
  extends IBaseUseCase<string, boolean> {}

export interface ICreateTrainerUC
  extends IBaseUseCase<CreateTrainerDTO, TrainerDTO | User> {}

export interface ICreateUserUC extends IBaseUseCase<CreateUserDTO, User> {}
export interface IForgotPasswordUC
  extends IBaseUseCase<PasswordResetDTO, void> {}
export interface IGoogleAuthUC
  extends IBaseUseCase<
    GoogleTokenDTO,
    {
      accessToken: string;
      refreshToken: string;
      userData: User;
    }
  > {}
export interface IOtpUC {
  createOtp(dtos: OtpDTO): Promise<Otp>;
  verifyOtp(dtos: OtpDTO): Promise<void>;
  resendOtp(dtos: OtpDTO): Promise<void>;
}

export interface ISendPasswordRestLinkUC
  extends IBaseUseCase<CreatePassResetTokenDTO, PasswordResetToken> {}
export interface ISigninUserUC
  extends IBaseUseCase<
    SignInDTO,
    {
      accessToken: string;
      refreshToken: string;
      userData: User | TrainerDTO;
    }
  > {}
export interface ITokenUC {
  refreshToken(refreshToken: string): Promise<string>;
  validateToken(accessToken: string): Promise<JwtPayload>;
}

export interface IUpdateTRProfileUC
  extends IBaseUseCase<UpdateTrainerDetailsDTO, TrainerDTO> {}
export interface IUpdateUserProfileUC
  extends IBaseUseCase<UpdateUserDetailsDTO, User> {}
