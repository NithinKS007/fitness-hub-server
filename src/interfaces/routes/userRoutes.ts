import express from "express"
import { authenticate } from "../middlewares/authenticate"
import { UserController } from "../../application/controllers/userController"

const userRoutes = express.Router()
userRoutes.get("/trainers",UserController.getApprovedTrainers)
userRoutes.get("/trainers/:_id",UserController.getApprovedTrainerDetailsWithSub)

// USER PROFILE ROUTE
userRoutes.put("/update-profile",authenticate,UserController.updateUserProfile)

export default userRoutes