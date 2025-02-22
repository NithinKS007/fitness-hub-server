import express from "express"
import { AuthController } from "../../application/controllers/authController"
import { authenticate } from "../middlewares/authenticate";


const authRoutes = express.Router()
authRoutes.post("/sign-up", AuthController.signup);  
authRoutes.post("/sign-in", AuthController.signin); 
authRoutes.post("/verify-otp", AuthController.verifyOtp); 
authRoutes.post("/resend-otp",AuthController.resendOtp)
authRoutes.post("/forgot-password", AuthController.generatePassResetLink)
authRoutes.patch("/forgot-password/:token", AuthController.forgotPassword);
authRoutes.post("/google",AuthController.createGoogleUser)
authRoutes.post("/trainer-entroll",AuthController.createTrainer)

authRoutes.get("/check-blockStatus",authenticate,AuthController.checkBlockStatus)
authRoutes.put("/update-profile",authenticate,AuthController.updateUserProfile)
authRoutes.patch("/update-password",authenticate,AuthController.changePassword)
authRoutes.post("/refresh-token",AuthController.refreshAccessToken)
authRoutes.post("/sign-out",AuthController.signOut)


export default authRoutes


