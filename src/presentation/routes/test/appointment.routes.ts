import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  updateAppointmentController,
  getAppointmentsController,
} from "@di/container-resolver";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";
import express from "express";
const router = express.Router();

router.use(authenticate)

router.get("/appointments",authorizeRole(["trainer","user"]),asyncHandler(getAppointmentsController.handle.bind(getAppointmentsController))); // pass status in the req.query
router.patch("/appointments/:id",authorizeRole(["trainer","user"]),asyncHandler(updateAppointmentController.handle.bind(updateAppointmentController))); // pass action in the req.query

export default router