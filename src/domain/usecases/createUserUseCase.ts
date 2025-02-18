import { UserRepository } from "../interfaces/userRepository";
import { OtpRepository } from "../interfaces/otpRepository";
import { User } from "../entities/userEntity";
import { CreateUserDTO } from "../../application/dtos";
import { hashPassword } from "../../shared/utils/hashPassword";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendEmail } from "../../infrastructure/services/emailService";
import generateOtp from "../../shared/utils/otpGenerator";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository,private otpRepository:OtpRepository) {}
  public async createUser(data: CreateUserDTO): Promise<User> {
    const {
      fname,
      lname,
      email,
      password,
    } = data;
  
    if (
      !fname ||
      !lname ||
      !email ||
      !password
    ) {
      throw new Error(HttpStatusMessages.AllFieldsAreRequired);
    }

    const existinguser = await this.userRepository.findUserByEmail({email:email})
    if(existinguser && existinguser.otpVerified) {
      throw new Error(HttpStatusMessages.EmailConflict)
    }
    if(existinguser&&!existinguser.otpVerified && existinguser.googleVerified){
      throw new Error(HttpStatusMessages.DifferentLoginMethod)
    }
    if(existinguser && !existinguser.otpVerified){
      const otp = generateOtp(6)
      await this.otpRepository.createOtp({ email, otp });
      await sendEmail(email, "OTP for Registration",`Your OTP is ${otp}. Please do not share this OTP with anyone.`);
      return existinguser;
    }
  
    const hashedPassword = await hashPassword(password)
    const userData = await this.userRepository.createUser({...data,password:hashedPassword});
    const otp = generateOtp(6)
    await this.otpRepository.createOtp({email,otp})
    await sendEmail(email,"OTP for Registration",`Your OTP is ${otp}. Please do not share this OTP with anyone.`)
    return userData
  }

  public async createTrainer(data: CreateUserDTO): Promise<User> {
    const {
      fname,
      lname,
      email,
      password,
      dateOfBirth,
      phone,
      yearsOfExperience
    } = data;


    if (
      !fname ||
      !lname ||
      !email ||
      !password ||
      !yearsOfExperience ||
      !dateOfBirth||
      !phone
    ) {
      throw new Error(HttpStatusMessages.AllFieldsAreRequired);
    }

    console.log("exp",yearsOfExperience)

    const existinguser = await this.userRepository.findUserByEmail({email:email})
    if(existinguser && existinguser.otpVerified) {
      throw new Error(HttpStatusMessages.EmailConflict)
    }
    if(existinguser&&!existinguser.otpVerified && existinguser.googleVerified){
      throw new Error(HttpStatusMessages.DifferentLoginMethod)
    }
    if(existinguser && !existinguser.otpVerified){
      const otp = generateOtp(6)
      await this.otpRepository.createOtp({ email, otp });
      await sendEmail(email, "OTP for Registration",`Your OTP is ${otp}. Please do not share this OTP with anyone.`);
      return existinguser;
    }

    console.log("req.body for registering trainer",data)
    const createdTrainerData = {...data, trainerData: { yearsOfExperience: yearsOfExperience},role:"trainer",dateOfBirth:new Date(dateOfBirth as string)}
    const hashedPassword = await hashPassword(password)
    const createdTrainer = await this.userRepository.createUser({...createdTrainerData,password:hashedPassword});
    const otp = generateOtp(6)
    await this.otpRepository.createOtp({email,otp})
    await sendEmail(email,"OTP for Registration",`Your OTP is ${otp}. Please do not share this OTP with anyone.`)
    return createdTrainer
  }
}
