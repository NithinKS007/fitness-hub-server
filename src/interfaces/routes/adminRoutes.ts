import express from "express"
import { AdminController } from "../controllers/adminController"
import { authenticate } from "../middlewares/authenticate";
import { AdminDashboardController } from "../controllers/adminDashBoardController";

const adminRoutes = express.Router()

//USER MANAGEMENT ROUTES
adminRoutes.get("/users",authenticate,AdminController.getUsers)
adminRoutes.get("/users/:_id",authenticate,AdminController.getUserDetails)
adminRoutes.patch("/users/:_id",authenticate,AdminController.updateBlockStatus)

//TRAINER MANAGEMENT ROUTES
adminRoutes.get("/trainers",authenticate,AdminController.getTrainers)
adminRoutes.get("/trainers/:_id",authenticate,AdminController.getTrainerDetails)
adminRoutes.get("/pending-approval",authenticate,AdminController.getPendingTrainerApprovals)
adminRoutes.patch("/pending-approval/:_id",authenticate, AdminController.approveRejectTrainerVerification)
adminRoutes.get("/trainer/subscriptions/:_id",authenticate, AdminController.getTrainerSubscriptions)

//DASHBOARD MANAGEMENT ROUTES
adminRoutes.get("/dashboard",authenticate,AdminDashboardController.getAdminDashBoardData)

export default adminRoutes
