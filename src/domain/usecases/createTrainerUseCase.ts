import { UserRepository } from "../interfaces/userRepository";
import { OtpRepository } from "../interfaces/otpRepository";
import { CreateTrainerDTO} from "../../application/dtos";
import { hashPassword } from "../../shared/utils/hashPassword";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendEmail } from "../../infrastructure/services/emailService";
import generateOtp from "../../shared/utils/otpGenerator";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { Trainer } from "../entities/trainerEntity";
import { TrainerRepository } from "../interfaces/trainerRepository";
import { User } from "../entities/userEntity";

export class CreateTrainerUseCase {
  constructor(
    private userRepository: UserRepository,
    private otpRepository: OtpRepository,
    private trainerRepository: TrainerRepository
  ) {}

  public async create(data: CreateTrainerDTO): Promise< Trainer | User > {
    const { fname,lname,email,password, dateOfBirth, phone, yearsOfExperience, specializations, certificate} = data;

    if (
      !fname ||
      !lname ||
      !email ||
      !password ||
      !yearsOfExperience ||
      !dateOfBirth ||
      !phone
    ) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    const existinguser = await this.userRepository.findByEmail({
      email: email,
    });
    if (existinguser && existinguser.otpVerified) {
      throw new validationError(HttpStatusMessages.EmailConflict);
    }
    if (
      existinguser &&
      !existinguser.otpVerified &&
      existinguser.googleVerified
    ) {
      throw new validationError(HttpStatusMessages.DifferentLoginMethod);
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

    const createdData = await this.trainerRepository.create(trainerSpecificData);

    const otp = generateOtp(6);
    await this.otpRepository.createOtp({ email, otp });
    await sendEmail(email,"OTP for Registration",`Your OTP is ${otp}. Please do not share this OTP with anyone.`)
    return {
      ...createdData,
      ...createdTrainer,
    };
  }
}
