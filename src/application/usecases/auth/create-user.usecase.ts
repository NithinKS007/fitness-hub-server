import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IOtpRepository } from "@domain/interfaces/IOtpRepository";
import { CreateUserDTO } from "@application/dtos/user-dtos";
import {
  ApplicationStatus,
  AuthStatus,
} from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IEmailService } from "@application/interfaces/communication/IEmail.service";
import { IOTPService } from "@application/interfaces/security/IGenerate-otp.service";
import { IEncryptionService } from "@application/interfaces/security/IEncryption.service";
import { IUser } from "@domain/entities/user.entity";
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
    private encryptionService: IEncryptionService
  ) {}

  private async sendOtpEmail(email: string): Promise<void> {
    const otp = this.otpService.generateOtp(6);
    await this.otpRepository.create({ email, otp });
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
  }: CreateUserDTO): Promise<IUser> {
    if (!fname || !lname || !email || !password) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    const existinguser = await this.userRepository.findOne({
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

    const hashedPassword = await this.encryptionService.hash(password);
    const userData = await this.userRepository.create({
      ...{ fname, lname, email },
      password: hashedPassword,
    });
    await this.sendOtpEmail(email);
    return userData;
  }
}
