import { Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages} from "../../shared/constants/httpResponseStructure";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { MongoOtpRepository } from "../../infrastructure/databases/repositories/mongoOtpRepository";
import { CreateUserUseCase } from "../../domain/usecases/createUserUseCase";
import { SigninUserUseCase } from "../../domain/usecases/signInUserUseCase";
import { OtpUseCase } from "../../domain/usecases/otpUseCase";
import { ForgotPasswordUseCase } from "../../domain/usecases/forgotPasswordUseCase";
import { GoogleAuthUseCase } from "../../domain/usecases/googleAuthUseCase";
import { MonogPasswordResetRepository } from "../../infrastructure/databases/repositories/monogPasswordResetRepository";

const mongouserRepository = new MongoUserRepository();
const mongoOtpRepository = new MongoOtpRepository()
const monogPasswordResetRepository = new MonogPasswordResetRepository()
const createUser = new CreateUserUseCase(mongouserRepository,mongoOtpRepository);
const signinUser = new SigninUserUseCase(mongouserRepository)
const otp = new OtpUseCase(mongoOtpRepository,mongouserRepository)
const passwordReset = new ForgotPasswordUseCase(mongouserRepository,monogPasswordResetRepository)
const googleAuth = new GoogleAuthUseCase(mongouserRepository)

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {

      console.log("req.body",req.body)
      const createdUser = await createUser.execute(req.body)
      sendResponse(res, HttpStatusCodes.OK, createdUser, HttpStatusMessages.UserCreatedSuccessfully);
    } catch (error:any) {
      console.log(`Error in  signup : ${error}`)
      if(error.message === HttpStatusMessages.EmailConflict){
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.EmailConflict);
      } else if (error.message=== HttpStatusMessages.FailedToSendEmail){
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.FailedToSendEmail);
      }  else if (error.message=== HttpStatusMessages.DifferentLoginMethod){
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.DifferentLoginMethod)
      }  else  {
        sendResponse(res, HttpStatusCodes.InternalServerError, null, HttpStatusMessages.FailedToCreateUser);
      }
    }
  }

  static async signin(req: Request, res: Response): Promise<void> {
    try {
       const userData = await signinUser.execute(req.body)
       sendResponse(res,HttpStatusCodes.OK,userData,HttpStatusMessages.LoginSuccessful)
    } catch (error:any) {
      console.log(`Error in  signin : ${error}`)

      if(error.message===HttpStatusMessages.EmailNotFound){
        sendResponse(res,HttpStatusCodes.BadRequest,null,HttpStatusMessages.EmailNotFound)
      } else if (error.message=== HttpStatusMessages.DifferentLoginMethod){
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.DifferentLoginMethod)
      } else if(error.message===HttpStatusMessages.IncorrectPassword){
        sendResponse(res,HttpStatusCodes.BadRequest,null,HttpStatusMessages.IncorrectPassword)
      }else if(error.message===HttpStatusMessages.AccountBlocked){
        sendResponse(res,HttpStatusCodes.Forbidden,null,HttpStatusMessages.AccountBlocked)
      }else if (error.message===HttpStatusMessages.InvalidOtp){
        sendResponse(res,HttpStatusCodes.Forbidden,null,HttpStatusMessages.InvalidOtp)
      }else{
        sendResponse(res,HttpStatusCodes.InternalServerError,null,HttpStatusMessages.FailedToSignin)
      }
    }
  }
  static async verifyOtp (req:Request,res:Response):Promise<void> {
    try {
       await otp.verifyOtpByEmail(req.body)
       sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.RegistrationSuccessful)
    } catch (error:any) {
      console.log(`Error in  verifyotp : ${error}`)
      if(error.message===HttpStatusMessages.InvalidOtp){
        sendResponse(res,HttpStatusCodes.BadRequest,null,HttpStatusMessages.InvalidOtp)
      } else {
        sendResponse(res,HttpStatusCodes.InternalServerError,null,HttpStatusMessages.InternalServerError)
      }
    }
  }
  static async resendOtp(req:Request,res:Response):Promise<void> {
    try {
    console.log("body",req.body)
    await otp.resendOtp(req.body)
    sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.OtpSendSuccessful)
    } catch (error:any) {
      console.log(`Error in  resendotp : ${error}`)
      if(error.message===HttpStatusMessages.AlreadyUserVerifiedByOtp){
        sendResponse(res,HttpStatusCodes.BadRequest,null,HttpStatusMessages.AlreadyUserVerifiedByOtp)
      }else {
        sendResponse(res,HttpStatusCodes.InternalServerError,null,HttpStatusMessages.InternalServerError)
      }
     
    }
  }
  static async generatePassResetLink(req:Request,res:Response):Promise<void> {
    try {
      console.log("email received for sending the otp link",req.body)
      const tokenData =  await passwordReset.generatePassResetLink(req.body)
      sendResponse(res,HttpStatusCodes.OK,tokenData.email,HttpStatusMessages.LinkSentToEmail)
    } catch (error:any) {
      console.log(`Error in  sending link to reset password : ${error}`);
      if(error.message===HttpStatusMessages.EmailNotFound){
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.EmailNotFound);
      }else if (error.message=== HttpStatusMessages.DifferentLoginMethod){
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.DifferentLoginMethod)
      } else if(error.message===HttpStatusMessages.AccountNotVerified) {
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.AccountNotVerified);
      } else{
        sendResponse(res, HttpStatusCodes.InternalServerError, null, HttpStatusMessages.FailedToSendEmail);
      }
    }
  }
  static async forgotPassword(req:Request,res:Response) :Promise <void> {
    try {
        const { token } = req.params
        const { password } = req.body
        await passwordReset.forgotPassword({resetToken:token,password:password})
        sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.PassWordResetSuccess)
    } catch (error:any) {
      if(error.message===HttpStatusMessages.LinkExpired){
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.LinkExpired);
      } else if(error.message===HttpStatusMessages.EmailNotFound) {
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.EmailNotFound);
      } else{
        sendResponse(res, HttpStatusCodes.InternalServerError, null, HttpStatusMessages.InternalServerError)
      }
    }
  }
  static async createGoogleUser(req:Request,res:Response):Promise <void> {
    try {
      const userData =  await googleAuth.createGoogleUser(req.body)
      console.log("userdata",userData)
      sendResponse(res,HttpStatusCodes.OK,userData,HttpStatusMessages.LoginSuccessful)
  } catch (error:any) {
    if(error.message===HttpStatusMessages.EmailNotFound){
      sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.EmailNotFound);
    } else if (error.message===HttpStatusMessages.AccountBlocked){
      sendResponse(res, HttpStatusCodes.Forbidden, null, HttpStatusMessages.AccountBlocked)
    } else if (error.message===HttpStatusMessages.DifferentLoginMethod){
      sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.DifferentLoginMethod)
    } else {
      sendResponse(res, HttpStatusCodes.InternalServerError, null, HttpStatusMessages.InternalServerError)
    }
  }
}



}
