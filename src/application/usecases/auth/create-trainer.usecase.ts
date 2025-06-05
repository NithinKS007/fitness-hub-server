import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { CreateTrainerDTO } from "../../dtos/trainer-dtos";
import {
  ApplicationStatus,
  AuthStatus,
} from "../../../shared/constants/index.constants";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { Trainer } from "../../../domain/entities/trainer.entities";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { User } from "../../../domain/entities/user.entities";
import { IEmailService } from "../../interfaces/communication/IEmail.service";
import { IOTPService } from "../../interfaces/security/IGenerate-otp.service";
import { IPasswordService } from "../../interfaces/security/IPassword.service";
import { RoleType } from "../../dtos/auth-dtos";

/*  
    Purpose: Creates a new trainer and handles OTP verification during registration.
    Incoming: { fname, lname, email, password, dateOfBirth, phone, yearsOfExperience, specializations, certificate }
    Returns: { trainerData } (Newly created trainer's data along with user data)
    Throws:
        - Validation errors if any required field is missing.
        - Error if the email is already registered or has a different verification method.
        - Sends OTP email if the user exists but hasn't verified yet.
*/

export class CreateTrainerUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository,
    private trainerRepository: ITrainerRepository,
    private emailService: IEmailService,
    private otpService: IOTPService,
    private passwordService: IPasswordService
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
  }: CreateTrainerDTO): Promise<Trainer | User> {
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
    const hashedPassword = await this.passwordService.hashPassword(password);
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
