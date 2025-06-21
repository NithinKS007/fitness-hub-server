import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IOtpRepository } from "@domain/interfaces/IOtpRepository";
import { CreateTrainerDTO, Trainer } from "@application/dtos/trainer-dtos";
import {
  ApplicationStatus,
  AuthStatus,
} from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { IEmailService } from "@application/interfaces/communication/IEmail.service";
import { IOTPService } from "@application/interfaces/security/IGenerate-otp.service";
import { IEncryptionService } from "@application/interfaces/security/IEncryption.service";
import { RoleType } from "@application/dtos/auth-dtos";
import { IUser } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";

/*  
    Purpose: Creates a new trainer and handles OTP verification during registration.
    Incoming: { fname, lname, email, password, dateOfBirth, phone, yearsOfExperience, specializations, certificate }
    Returns: { trainerData } (Newly created trainer's data along with user data)
    Throws:
        - Validation errors if any required field is missing.
        - Error if the email is already registered or has a different verification method.
        - Sends OTP email if the user exists but hasn't verified yet.
*/

@injectable()
export class CreateTrainerUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.OtpRepository)
    private otpRepository: IOtpRepository,
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository,
    @inject(TYPES_SERVICES.EmailService) private emailService: IEmailService,
    @inject(TYPES_SERVICES.OTPService) private otpService: IOTPService,
    @inject(TYPES_SERVICES.EncryptionService)
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
    dateOfBirth,
    phone,
    yearsOfExperience,
    specializations,
    certificate,
  }: CreateTrainerDTO): Promise<Trainer | IUser> {
    if (
      !fname ||
      !lname ||
      !email ||
      !password ||
      !yearsOfExperience ||
      !dateOfBirth ||
      !phone
    ) {
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

    const createdTrainerData = {
      fname,
      lname,
      email,
      phone,
      role: RoleType.Trainer,
      dateOfBirth: new Date(dateOfBirth),
    };
    const hashedPassword = await this.encryptionService.hash(password);
    const createdTrainer = await this.userRepository.create({
      ...createdTrainerData,
      password: hashedPassword,
    });

    const trainerSpecificData = {
      yearsOfExperience,
      userId: createdTrainer._id,
      specializations,
      certificate,
    };

    const createdData = await this.trainerRepository.create(
      trainerSpecificData
    );
    await this.sendOtpEmail(email);
    return {
      ...createdData,
      ...createdTrainer,
    };
  }
}
