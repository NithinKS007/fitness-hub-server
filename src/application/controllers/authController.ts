import { Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages} from "../../shared/constants/httpResponseStructure";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { MongoOtpRepository } from "../../infrastructure/databases/repositories/mongoOtpRepository";
import { CreateUserUseCase } from "../../domain/usecases/createUserUseCase";
import { SigninUserUseCase } from "../../domain/usecases/signInUserUseCase";
import { OtpUseCase } from "../../domain/usecases/otpUseCase";

const mongouserRepository = new MongoUserRepository();
const mongoOtpRepository = new MongoOtpRepository()
const createUser = new CreateUserUseCase(mongouserRepository,mongoOtpRepository);
const signinUser = new SigninUserUseCase(mongouserRepository)
const otp = new OtpUseCase(mongoOtpRepository,mongouserRepository)

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const createdUser = await createUser.execute(req.body)
      sendResponse(res, HttpStatusCodes.OK, createdUser, HttpStatusMessages.UserCreatedSuccessfully);
    } catch (error:any) {
      console.log(`Error in  signup : ${error}`)
      if(error.message === HttpStatusMessages.EmailConflict){
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.EmailConflict);
      } else if (error.message=== HttpStatusMessages.FailedToSendEmail){
        sendResponse(res, HttpStatusCodes.BadRequest, null, HttpStatusMessages.FailedToSendEmail);
      } else  {
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
      }else if(error.message===HttpStatusMessages.IncorrectPassword){
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
      if(error.message===HttpStatusMessages.InvalidOtp){
        sendResponse(res,HttpStatusCodes.BadRequest,null,HttpStatusMessages.InvalidOtp)
      } else {
        sendResponse(res,HttpStatusCodes.InternalServerError,null,HttpStatusMessages.InternalServerError)
      }
    }
  }
  static async ResendOtp(req:Request,res:Response):Promise<void> {
    try {
    await otp.resendOtp(req.body)
    sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.OtpSendSuccessful)
    } catch (error:any) {
      if(error.message===HttpStatusMessages.AlreadyUserVerifiedByOtp){
        sendResponse(res,HttpStatusCodes.BadRequest,null,HttpStatusMessages.AlreadyUserVerifiedByOtp)
      }else {
        sendResponse(res,HttpStatusCodes.InternalServerError,null,HttpStatusMessages.InternalServerError)
      }
     
    }
  }
}
