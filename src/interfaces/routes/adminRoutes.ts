import express from "express"
import { AdminController } from "../../application/controllers/adminController"
import { authenticate } from "../middlewares/authenticate";

const adminRoutes = express.Router()

adminRoutes.get("/users",AdminController.getUsers)
adminRoutes.get("/users/:_id",AdminController.getUserDetails)
adminRoutes.patch("/users/:_id",AdminController.updateBlockStatus)
adminRoutes.patch("/trainers/:_id", AdminController.trainerVerification)


export default adminRoutes
