import otpGenerator from "otp-generator";

const generateOtp = (length: number): string => {
  return otpGenerator.generate(length, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
}
export default generateOtp
