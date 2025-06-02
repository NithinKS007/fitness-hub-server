import express from "express"
import { authenticate } from "../middlewares/auth.middleware";
import expressAsyncHandler from "express-async-handler";
import { 
  userSessionController, 
  googleAuthController, 
  otpController, 
  passwordController, 
  createController 
} from "../../di/di";

const authRoutes = express.Router()

//REGISTRATION AND SIGNIN ROUTES
authRoutes.post("/sign-up", expressAsyncHandler(createController.signUpUser.bind(createController)))
authRoutes.post("/trainer-sign-up",expressAsyncHandler(createController .signUpTrainer.bind(createController)))
authRoutes.post("/google",expressAsyncHandler(googleAuthController.handleGoogleLogin.bind(googleAuthController)))
authRoutes.post("/sign-in", expressAsyncHandler(userSessionController.signin.bind(userSessionController)))

//OTP ROUTES
authRoutes.post("/otp/verify", expressAsyncHandler(otpController.verifyOtp.bind(otpController)))
authRoutes.post("/otp/resend",expressAsyncHandler(otpController.resendOtp.bind(otpController)))

//PASSWORD ROUTES
authRoutes.post("/password-reset", expressAsyncHandler(passwordController.generateResetLink.bind(passwordController)))
authRoutes.patch("/password-reset/:token", expressAsyncHandler(passwordController.forgotPassword.bind(passwordController)))
authRoutes.patch("/password/change",authenticate,expressAsyncHandler(passwordController.changePassword.bind(passwordController)))

//AUTHENTICATION AND SIGNOUT ROUTES
authRoutes.post("/refresh-token",expressAsyncHandler(userSessionController.refreshAccessToken.bind(userSessionController)))
authRoutes.post("/sign-out",expressAsyncHandler(userSessionController.signOut.bind(userSessionController)))

export default authRoutes


