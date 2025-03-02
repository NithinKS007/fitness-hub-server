import express from "express"
import { AdminController } from "../../application/controllers/adminController"
import { authenticate } from "../middlewares/authenticate";

const adminRoutes = express.Router()

adminRoutes.get("/users",authenticate,AdminController.getUsers)
adminRoutes.get("/users/:_id",authenticate,AdminController.getUserDetails)
adminRoutes.patch("/users/:_id",authenticate,AdminController.updateBlockStatus)

adminRoutes.get("/trainers",authenticate,AdminController.getTrainers)
adminRoutes.get("/trainers/:_id",authenticate,AdminController.getTrainerDetails)
adminRoutes.get("/pending-approval",authenticate,AdminController.getApprovalPendingList)
adminRoutes.patch("/pending-approval/:_id",authenticate, AdminController.approveRejectTrainerVerification)
adminRoutes.get("/trainer/subscriptions/:_id",authenticate, AdminController.getTrainerSubscriptions)

export default adminRoutes
