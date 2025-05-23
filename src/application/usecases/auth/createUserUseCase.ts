import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { User } from "../../../domain/entities/user";
import { CreateUserDTO } from "../../dtos/user-dtos";
import { hashPassword } from "../../../shared/utils/hashPassword";
import { AuthStatus } from "../../../shared/constants/index-constants";
import generateOtp from "../../../shared/utils/otpGenerator";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { IEmailService } from "../../interfaces/communication/IEmailService";

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository,
    private emailService: IEmailService
  ) {}
  public async create({
    fname,
    lname,
    email,
    password,
  }: CreateUserDTO): Promise<User> {
    if (!fname || !lname || !email || !password) {
      throw new validationError(AuthStatus.AllFieldsAreRequired);
    }

    const existinguser = await this.userRepository.findByEmail({
      email: email,
    });
    if (existinguser && existinguser.otpVerified) {
      throw new validationError(AuthStatus.EmailConflict);
    }
    if (
      existinguser &&
      !existinguser.otpVerified &&
      existinguser.googleVerified
    ) {
      throw new validationError(AuthStatus.DifferentLoginMethod);
    }
    if (existinguser && !existinguser.otpVerified) {
      const otp = generateOtp(6);
      await this.otpRepository.createOtp({ email, otp });
      await this.emailService.sendEmail({
        to: email,
        subject: "OTP for Registration",
        text: `Your OTP is ${otp}. Please do not share this OTP with anyone.`,
      });
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
    await this.emailService.sendEmail({
      to: email,
      subject: "OTP for Registration",
      text: `Your OTP is ${otp}. Please do not share this OTP with anyone.`,
    });
    return userData;
  }
}
