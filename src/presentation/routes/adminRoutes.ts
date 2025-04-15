import express from "express"
import { AdminController } from "../controllers/adminController"
import { authenticate } from "../middlewares/authenticate";
import { AdminDashboardController } from "../controllers/adminDashBoardController";

const adminRoutes = express.Router()

//USER MANAGEMENT ROUTES
adminRoutes.get("/users",authenticate,AdminController.getUsers)
adminRoutes.get("/users/:userId",authenticate,AdminController.getUserDetails)
adminRoutes.patch("/users/:userId",authenticate,AdminController.updateBlockStatus)

//TRAINER MANAGEMENT ROUTES
adminRoutes.get("/trainers",authenticate,AdminController.getTrainers)
adminRoutes.get("/trainers/:trainerId",authenticate,AdminController.getTrainerDetails)
adminRoutes.get("/pending-approval",authenticate,AdminController.getPendingTrainerApprovals)
adminRoutes.patch("/pending-approval/:trainerId",authenticate, AdminController.approveRejectTrainerVerification)
adminRoutes.get("/trainer/subscriptions/:trainerId",authenticate, AdminController.getTrainerSubscriptions)

//DASHBOARD MANAGEMENT ROUTES
adminRoutes.get("/dashboard",authenticate,AdminDashboardController.getAdminDashBoardData)

//REVENUE MANAGEMENT ROUTES
adminRoutes.get("/revenue",authenticate,AdminController.getAdminRevenueHistory)

export default adminRoutes
