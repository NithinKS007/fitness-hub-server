import { Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { MongoOtpRepository } from "../../infrastructure/databases/repositories/mongoOtpRepository";
import { CreateUserUseCase } from "../../domain/usecases/createUserUseCase";
import { SigninUserUseCase } from "../../domain/usecases/signInUserUseCase";
import { OtpUseCase } from "../../domain/usecases/otpUseCase";
import { ForgotPasswordUseCase } from "../../domain/usecases/forgotPasswordUseCase";
import { GoogleAuthUseCase } from "../../domain/usecases/googleAuthUseCase";
import { MonogPasswordResetRepository } from "../../infrastructure/databases/repositories/monogPasswordResetRepository";
import { UserUseCase } from "../../domain/usecases/userUseCase";
import {
  authenticateRefreshToken,
  generateAccessToken,
} from "../../infrastructure/services/jwtService";
import { JwtPayload } from "jsonwebtoken";
import { CheckBlockStatus } from "../../domain/usecases/checkBlockStatus";

const mongouserRepository = new MongoUserRepository();
const mongoOtpRepository = new MongoOtpRepository();
const monogPasswordResetRepository = new MonogPasswordResetRepository();
const createUser = new CreateUserUseCase(
  mongouserRepository,
  mongoOtpRepository
);
const signinUser = new SigninUserUseCase(mongouserRepository);
const otp = new OtpUseCase(mongoOtpRepository, mongouserRepository);
const passwordReset = new ForgotPasswordUseCase(
  mongouserRepository,
  monogPasswordResetRepository
);
const googleAuth = new GoogleAuthUseCase(mongouserRepository);
const user = new UserUseCase(mongouserRepository);
const checkBlockStatus = new CheckBlockStatus(mongouserRepository);

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const createdUser = await createUser.createUser(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        createdUser,
        HttpStatusMessages.UserCreatedSuccessfully
      );
    } catch (error: any) {
      console.log(`Error in  signup : ${error}`);
      if (error.message === HttpStatusMessages.EmailConflict) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.EmailConflict
        );
      }
      if (error.message === HttpStatusMessages.AllFieldsAreRequired) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.AllFieldsAreRequired
        );
      } else if (error.message === HttpStatusMessages.FailedToSendEmail) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.FailedToSendEmail
        );
      } else if (error.message === HttpStatusMessages.DifferentLoginMethod) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.DifferentLoginMethod
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.FailedToCreateUser
        );
      }
    }
  }

  static async signin(req: Request, res: Response): Promise<void> {
    try {
      const { userData, accessToken, refreshToken } = await signinUser.execute(
        req.body
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { userData, accessToken },
        HttpStatusMessages.LoginSuccessful
      );
    } catch (error: any) {
      console.log(`Error in  signin : ${error}`);

      if (error.message === HttpStatusMessages.EmailNotFound) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.EmailNotFound
        );
      } else if (error.message === HttpStatusMessages.DifferentLoginMethod) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.DifferentLoginMethod
        );
      } else if (error.message === HttpStatusMessages.IncorrectPassword) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.IncorrectPassword
        );
      } else if (error.message === HttpStatusMessages.AccountBlocked) {
        sendResponse(
          res,
          HttpStatusCodes.Forbidden,
          null,
          HttpStatusMessages.AccountBlocked
        );
      } else if (error.message === HttpStatusMessages.InvalidOtp) {
        sendResponse(
          res,
          HttpStatusCodes.Forbidden,
          null,
          HttpStatusMessages.InvalidOtp
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.FailedToSignin
        );
      }
    }
  }
  static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      await otp.verifyOtpByEmail(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.RegistrationSuccessful
      );
    } catch (error: any) {
      console.log(`Error in  verifyotp : ${error}`);
      if (error.message === HttpStatusMessages.InvalidOtp) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.InvalidOtp
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.InternalServerError
        );
      }
    }
  }
  static async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      console.log("body", req.body);
      await otp.resendOtp(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.OtpSendSuccessful
      );
    } catch (error: any) {
      console.log(`Error in  resendotp : ${error}`);
      if (error.message === HttpStatusMessages.AlreadyUserVerifiedByOtp) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.AlreadyUserVerifiedByOtp
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.InternalServerError
        );
      }
    }
  }
  static async generatePassResetLink(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const tokenData = await passwordReset.generatePassResetLink(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        tokenData.email,
        HttpStatusMessages.LinkSentToEmail
      );
    } catch (error: any) {
      console.log(`Error in  sending link to reset password : ${error}`);
      if (error.message === HttpStatusMessages.EmailNotFound) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.EmailNotFound
        );
      } else if (error.message === HttpStatusMessages.DifferentLoginMethod) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.DifferentLoginMethod
        );
      } else if (error.message === HttpStatusMessages.AccountNotVerified) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.AccountNotVerified
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.FailedToSendEmail
        );
      }
    }
  }
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const { password } = req.body;
      await passwordReset.forgotPassword({
        resetToken: token,
        password: password,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.PassWordResetSuccess
      );
    } catch (error: any) {
      if (error.message === HttpStatusMessages.LinkExpired) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.LinkExpired
        );
      } else if (error.message === HttpStatusMessages.EmailNotFound) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.EmailNotFound
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.InternalServerError
        );
      }
    }
  }
  static async createGoogleUser(req: Request, res: Response): Promise<void> {
    try {
      const { userData, accessToken, refreshToken } =
        await googleAuth.createGoogleUser(req.body);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { userData, accessToken },
        HttpStatusMessages.LoginSuccessful
      );
    } catch (error: any) {
      if (error.message === HttpStatusMessages.EmailNotFound) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.EmailNotFound
        );
      } else if (error.message === HttpStatusMessages.AccountBlocked) {
        sendResponse(
          res,
          HttpStatusCodes.Forbidden,
          null,
          HttpStatusMessages.AccountBlocked
        );
      } else if (error.message === HttpStatusMessages.DifferentLoginMethod) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.DifferentLoginMethod
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.InternalServerError
        );
      }
    }
  }

  static async createTrainer(req: Request, res: Response): Promise<void> {
    try {
      const createdTrainer = await createUser.createTrainer(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        createdTrainer,
        HttpStatusMessages.UserCreatedSuccessfully
      );
    } catch (error: any) {
      if (error.message === HttpStatusMessages.AllFieldsAreRequired) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.AllFieldsAreRequired
        );
      } else if (error.message === HttpStatusMessages.EmailConflict) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.EmailConflict
        );
      } else if (error.message === HttpStatusMessages.FailedToSendEmail) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.FailedToSendEmail
        );
      } else if (error.message === HttpStatusMessages.DifferentLoginMethod) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.DifferentLoginMethod
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.InternalServerError
        );
      }
    }
  }
  static async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      console.log("req.body", req.body);
      const updatedUserData = await user.updateUserProfile(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedUserData,
        HttpStatusMessages.UserDetailsUpdated
      );
    } catch (error: any) {
      if (error.message === HttpStatusMessages.FailedToUpdateUserDetails) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.FailedToUpdateUserDetails
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.InternalServerError
        );
      }
    }
  }

  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.user;

      console.log("_id", _id, req.body);
      await user.changePassword({ _id, ...req.body });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.PasswordUpdated
      );
    } catch (error: any) {
      if (error.message === HttpStatusMessages.AllFieldsAreRequired) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.AllFieldsAreRequired
        );
      } else if (error.message === HttpStatusMessages.InvalidId) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.InvalidId
        );
      } else if (error.message === HttpStatusMessages.IncorrectPassword) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.IncorrectPassword
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.InternalServerError
        );
      }
    }
  }

  static async signOut(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.LogoutSuccessful
      );
    } catch (error) {
      sendResponse(
        res,
        HttpStatusCodes.InternalServerError,
        null,
        HttpStatusMessages.InternalServerError
      );
    }
  }

  static async refreshAccessToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req?.cookies?.refreshToken;
    if (!refreshToken) {
      sendResponse(
        res,
        HttpStatusCodes.Forbidden,
        null,
        HttpStatusMessages.NoRefreshToken
      );
      return;
    }
    const decoded = authenticateRefreshToken(refreshToken) as JwtPayload;
    const newAccessToken = generateAccessToken(decoded._id, decoded.role);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { newAccessToken },
      HttpStatusMessages.AccessTokenRefreshedSuccessFully
    );
  }
  static async checkBlockStatus(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.user;
      const blockstatus = await checkBlockStatus.checkBlockStatus(_id);
      sendResponse(
        res,
        HttpStatusCodes.OK,
         {isBlocked:blockstatus},
        "block status retrieved successfully"
      );
    } catch (error: any) {
      sendResponse(
        res,
        HttpStatusCodes.InternalServerError,
        null,
        HttpStatusMessages.InternalServerError
      );
    }
  }
}
