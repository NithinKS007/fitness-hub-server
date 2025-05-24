import express from "express"
import { AuthController } from "../controllers/auth/authController"
import { authenticate } from "../middlewares/authenticate";
import expressAsyncHandler from "express-async-handler";

const authRoutes = express.Router()

//REGISTRATION AND SIGNIN ROUTES
authRoutes.post("/sign-up", expressAsyncHandler(AuthController.createUser))
authRoutes.post("/trainer-sign-up",expressAsyncHandler(AuthController.createTrainer))
authRoutes.post("/google",expressAsyncHandler(AuthController.createGoogleUser))
authRoutes.post("/sign-in", expressAsyncHandler(AuthController.signin))

//OTP ROUTES
authRoutes.post("/otp/verify", expressAsyncHandler(AuthController.verifyOtp))
authRoutes.post("/otp/resend",expressAsyncHandler(AuthController.resendOtp))

//PASSWORD ROUTES
authRoutes.post("/password-reset", expressAsyncHandler(AuthController.generatePassResetLink))
authRoutes.patch("/password-reset/:token", expressAsyncHandler(AuthController.forgotPassword))
authRoutes.patch("/password/change",authenticate,expressAsyncHandler(AuthController.changePassword))

//AUTHENTICATION AND SIGNOUT ROUTES
authRoutes.post("/refresh-token",expressAsyncHandler(AuthController.refreshAccessToken))
authRoutes.post("/sign-out",expressAsyncHandler(AuthController.signOut))





export default authRoutes


