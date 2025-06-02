import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { User } from "../../../domain/entities/user.entities";
import { CreateUserDTO } from "../../dtos/user-dtos";
import {
  ApplicationStatus,
  AuthStatus,
} from "../../../shared/constants/index.constants";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { IEmailService } from "../../interfaces/communication/IEmail.service";
import { IOTPService } from "../../interfaces/security/IGenerate-otp.service";
import { IPasswordService } from "../../interfaces/security/IPassword.service";
/*  
    Purpose: Creates a new user, handles OTP verification, and sends OTP email.
    Incoming: { fname, lname, email, password } (User's first name, last name, email, and password)
    Returns: { userData } (Created user's data)
    Throws:
        - Validation errors if any required field is missing.
        - Error if the email is already registered with an existing user.
        - Error if the email is registered with a different login method (Google, for example).
        - Sends OTP email if the user exists but has not verified their OTP.
*/

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository,
    private emailService: IEmailService,
    private otpService: IOTPService,
    private passwordService: IPasswordService
  ) {}

  private async sendOtpEmail(email: string): Promise<void> {
    const otp = this.otpService.generateOtp(6);
    await this.otpRepository.createOtp({ email, otp });
    await this.emailService.sendEmail({
      to: email,
      subject: "OTP for Registration",
      text: `Your OTP is ${otp}. Please do not share this OTP with anyone.`,
    });
  }

  async execute({
    fname,
    lname,
    email,
    password,
  }: CreateUserDTO): Promise<User> {
    if (!fname || !lname || !email || !password) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
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
      await this.sendOtpEmail(email);
      return existinguser;
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const userData = await this.userRepository.create({
      ...{ fname, lname, email },
      password: hashedPassword,
    });
    await this.sendOtpEmail(email);
    return userData;
  }
}
