import express from "express"
import { AdminController } from "../../application/controllers/adminController"
import { authenticate } from "../middlewares/authenticate";

const adminRoutes = express.Router()

adminRoutes.get("/users",authenticate,AdminController.getUsers)
adminRoutes.get("/users/:_id",authenticate,AdminController.getUserDetails)
adminRoutes.patch("/users/:_id",authenticate,AdminController.updateBlockStatus)

adminRoutes.patch("/trainers/:_id",authenticate, AdminController.trainerVerification)
// adminRoutes.get("/trainers",authenticate,AdminController.getTrainers)
// adminRoutes.get("/trainers/:_id",authenticate,AdminController.getTrainerDetails)
// adminRoutes.patch("/trainers/:_id",authenticate,AdminController.updateBlockStatus)

export default adminRoutes
