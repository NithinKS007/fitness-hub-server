import express from "express"
import { AuthController } from "../controllers/authController"
import { authenticate } from "../middlewares/authenticate";

const authRoutes = express.Router()

//REGISTRATION AND SIGNIN ROUTES
authRoutes.post("/sign-up", AuthController.createUser); 
authRoutes.post("/trainer-entroll",AuthController.createTrainer)
authRoutes.post("/google",AuthController.createGoogleUser)
authRoutes.post("/sign-in", AuthController.signin); 

//OTP ROUTES
authRoutes.post("/verify-otp", AuthController.verifyOtp); 
authRoutes.post("/resend-otp",AuthController.resendOtp)

//PASSWORD ROUTES
authRoutes.post("/forgot-password", AuthController.generatePassResetLink)
authRoutes.patch("/forgot-password/:token", AuthController.forgotPassword);
authRoutes.patch("/update-password",authenticate,AuthController.changePassword)

//AUTHENTICATION AND SIGNOUT ROUTES
authRoutes.post("/refresh-token",AuthController.refreshAccessToken)
authRoutes.post("/sign-out",AuthController.signOut)





export default authRoutes


