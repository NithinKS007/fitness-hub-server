import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { CreateTrainerDTO } from "../../dtos/trainer-dtos";
import { hashPassword } from "../../../shared/utils/hashPassword";
import { AuthenticationStatusMessage } from "../../../shared/constants/httpResponseStructure";
import generateOtp from "../../../shared/utils/otpGenerator";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { Trainer } from "../../../domain/entities/trainer";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { User } from "../../../domain/entities/user";
import { IEmailService } from "../../interfaces/communication/IEmailService";

export class CreateTrainerUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository,
    private trainerRepository: ITrainerRepository,
    private emailService:IEmailService
  ) {}

  public async create({
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
      await this.emailService.sendEmail({
        to:email,
        subject:"OTP for Registration",
        text:`Your OTP is ${otp}. Please do not share this OTP with anyone.`
    });
      return existinguser;
    }

    const createdTrainerData = {
      fname,
      lname,
      email,
      phone,
      role: "trainer",
      dateOfBirth: new Date(dateOfBirth),
    };
    const hashedPassword = await hashPassword(password);
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

    const otp = generateOtp(6);
    await this.otpRepository.createOtp({ email, otp });
    await this.emailService.sendEmail({
      to:email,
      subject:"OTP for Registration",
      text:`Your OTP is ${otp}. Please do not share this OTP with anyone.`
  });
    return {
      ...createdData,
      ...createdTrainer,
    };
  }
}
