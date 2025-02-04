import { UserRepository } from "../../interfaces/userRepository";
import { OtpRepository } from "../../interfaces/otpRepository";
import { User } from "../../entities/userEntity";
import { CreateUserDTO } from "../../../application/dtos";
import { hashPassword } from "../../../shared/utils/hashPassword";
import { HttpStatusMessages } from "../../../shared/constants/httpResponseStructure";
import otpGenerator from "otp-generator"
import { sendEmail } from "../../../infrastructure/services/emailService";

export class createUserUseCase {
  constructor(private userRepository: UserRepository,private otpRepository:OtpRepository) {}
  public async execute(data: CreateUserDTO): Promise<User> {

    const {email, password } = data
    const existinguser = await this.userRepository.findUserByEmail({email:email})
    if(existinguser) {
      throw new Error(HttpStatusMessages.EmailConflict)
    }
    const hashedPassword = await hashPassword(password)
    const userData = await this.userRepository.createUser({...data,password:hashedPassword});

   const otp = otpGenerator.generate(6,{
    digits:true,
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars:false,
   })

    await this.otpRepository.createOtp({email,otp})
    await sendEmail(email,"OTP for Registration",`Your OTP is ${otp}. Please do not share this OTP with anyone.`)
    
    return userData
  }
}
