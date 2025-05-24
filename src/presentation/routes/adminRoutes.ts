import express from "express"
import { AdminController } from "../controllers/admin/adminController"
import { authenticate } from "../middlewares/authenticate";
import { AdminDashboardController } from "../controllers/dashboard/adminDashBoardController";
import expressAsyncHandler from "express-async-handler";
const adminRoutes = express.Router()

//USER MANAGEMENT ROUTES
adminRoutes.get("/users",authenticate,expressAsyncHandler(AdminController.getUsers))
adminRoutes.get("/users/:userId",authenticate,expressAsyncHandler(AdminController.getUserDetails))
adminRoutes.patch("/users/:userId",authenticate,expressAsyncHandler(AdminController.updateBlockStatus))

//TRAINER MANAGEMENT ROUTES
adminRoutes.get("/trainers",authenticate,expressAsyncHandler(AdminController.getTrainers))
adminRoutes.get("/trainers/:trainerId",authenticate,expressAsyncHandler(AdminController.getTrainerDetails))
adminRoutes.get("/pending-approval",authenticate,expressAsyncHandler(AdminController.getPendingTrainerApprovals))
adminRoutes.patch("/pending-approval/:trainerId",authenticate, expressAsyncHandler(AdminController.approveRejectTrainerVerification))
adminRoutes.get("/trainer/subscriptions/:trainerId",authenticate, expressAsyncHandler(AdminController.getTrainerSubscriptions))

//DASHBOARD MANAGEMENT ROUTES
adminRoutes.get("/dashboard",authenticate,expressAsyncHandler(AdminDashboardController.getAdminDashBoardData))

//REVENUE MANAGEMENT ROUTES
adminRoutes.get("/revenue",authenticate,expressAsyncHandler(AdminController.getAdminRevenueHistory))

export default adminRoutes
