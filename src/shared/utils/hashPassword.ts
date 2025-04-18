import bcrypt from "bcrypt";
import { PasswordStatusMessage } from "../constants/httpResponseStructure";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds: number = 10;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.log(`Error hashing password: ${error}`);
    throw new Error(PasswordStatusMessage.FailedToHashPassword);
  }
};

export const comparePassword = async (userPassword: string,hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(userPassword, hashedPassword);
  } catch (error) {
    console.log(`Error while comparing the passwords: ${error}`);
    throw new Error(PasswordStatusMessage.FailedToComparePassword)
  }
};


