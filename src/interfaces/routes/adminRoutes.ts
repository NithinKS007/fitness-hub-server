import express from "express"
import { adminController } from "../../application/controllers/adminController"

const adminRoutes = express.Router()

adminRoutes.get("/users",adminController.getUsers)
adminRoutes.patch("/users/:_id",adminController.updateBlockStatus)
// adminRoutes.get("/trainers",adminController.getTrainersApprovalRejectionList)
adminRoutes.patch("/trainers/:_id", adminController.trainerVerification);


export default adminRoutes
