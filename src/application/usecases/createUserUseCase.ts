import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { IOtpRepository } from "../../domain/interfaces/IOtpRepository";
import { User } from "../../domain/entities/userEntity";
import { CreateUserDTO } from "../dtos/userDTOs";
import { hashPassword } from "../../shared/utils/hashPassword";
import { AuthenticationStatusMessage } from "../../shared/constants/httpResponseStructure";
import { sendEmail } from "../../infrastructure/services/emailService";
import generateOtp from "../../shared/utils/otpGenerator";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository
  ) {}
  public async create({
    fname,
    lname,
    email,
    password,
  }: CreateUserDTO): Promise<User> {
    if (!fname || !lname || !email || !password) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
    }

    const existinguser = await this.userRepository.findByEmail({
      email: email,
    });
    if (existinguser && existinguser.otpVerified) {
      throw new validationError(AuthenticationStatusMessage.EmailConflict);
    }
    if (
      existinguser &&
      !existinguser.otpVerified &&
      existinguser.googleVerified
    ) {
      throw new validationError(AuthenticationStatusMessage.DifferentLoginMethod);
    }
    if (existinguser && !existinguser.otpVerified) {
      const otp = generateOtp(6);
      await this.otpRepository.createOtp({ email, otp });
      await sendEmail(
        email,
        "OTP for Registration",
        `Your OTP is ${otp}. Please do not share this OTP with anyone.`
      );
      return existinguser;
    }

    const hashedPassword = await hashPassword(password);
    const userData = await this.userRepository.create({
      ...{ fname, lname, email },
      password: hashedPassword,
    });
    const otp = generateOtp(6);
    console.log("otp generated for user registeration", otp);
    await this.otpRepository.createOtp({ email, otp });
    await sendEmail(
      email,
      "OTP for Registration",
      `Your OTP is ${otp}. Please do not share this OTP with anyone.`
    );
    return userData;
  }
}
