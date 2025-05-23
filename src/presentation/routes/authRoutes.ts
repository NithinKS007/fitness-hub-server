import express from "express"
import { AuthController } from "../controllers/auth/authController"
import { authenticate } from "../middlewares/authenticate";

const authRoutes = express.Router()

//REGISTRATION AND SIGNIN ROUTES
authRoutes.post("/sign-up", AuthController.createUser); 
authRoutes.post("/trainer-sign-up",AuthController.createTrainer)
authRoutes.post("/google",AuthController.createGoogleUser)
authRoutes.post("/sign-in", AuthController.signin); 

//OTP ROUTES
authRoutes.post("/otp/verify", AuthController.verifyOtp); 
authRoutes.post("/otp/resend",AuthController.resendOtp)

//PASSWORD ROUTES
authRoutes.post("/password-reset", AuthController.generatePassResetLink)
authRoutes.patch("/password-reset/:token", AuthController.forgotPassword);
authRoutes.patch("/password/change",authenticate,AuthController.changePassword)

//AUTHENTICATION AND SIGNOUT ROUTES
authRoutes.post("/refresh-token",AuthController.refreshAccessToken)
authRoutes.post("/sign-out",AuthController.signOut)





export default authRoutes


