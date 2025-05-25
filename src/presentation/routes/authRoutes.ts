import express from "express"
import { authenticate } from "../middlewares/authenticate";
import expressAsyncHandler from "express-async-handler";
import { authController } from "../../di/di";

const authRoutes = express.Router()

//REGISTRATION AND SIGNIN ROUTES
authRoutes.post("/sign-up", expressAsyncHandler(authController.createUser))
authRoutes.post("/trainer-sign-up",expressAsyncHandler(authController.createTrainer))
authRoutes.post("/google",expressAsyncHandler(authController.createGoogleUser))
authRoutes.post("/sign-in", expressAsyncHandler(authController.signin))

//OTP ROUTES
authRoutes.post("/otp/verify", expressAsyncHandler(authController.verifyOtp))
authRoutes.post("/otp/resend",expressAsyncHandler(authController.resendOtp))

//PASSWORD ROUTES
authRoutes.post("/password-reset", expressAsyncHandler(authController.generatePassResetLink))
authRoutes.patch("/password-reset/:token", expressAsyncHandler(authController.forgotPassword))
authRoutes.patch("/password/change",authenticate,expressAsyncHandler(authController.changePassword))

//AUTHENTICATION AND SIGNOUT ROUTES
authRoutes.post("/refresh-token",expressAsyncHandler(authController.refreshAccessToken))
authRoutes.post("/sign-out",expressAsyncHandler(authController.signOut))

export default authRoutes


