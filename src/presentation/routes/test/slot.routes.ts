import {
  bookAppointmentController,
  getUpComingSlotsController,
  createBookingSlotController,
  deleteBookingSlotController,
  getPendingSlotsController,
} from "@di/container-resolver";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import { slotSchema } from "@presentation/middlewares/validation-schemas/slot-schema";
import { validate } from "@presentation/middlewares/validation.middleware";
import express from "express";

const router = express.Router();
router.use(authenticate)

//USER SLOT ROUTES
router.get("/trainers/:id/slots",authorizeRole(["user"]),asyncHandler(getUpComingSlotsController.handle.bind(getUpComingSlotsController)));// User views trainer slots (view=calendar or table)
router.post("/slots/:id",authorizeRole(["user"]),asyncHandler(bookAppointmentController.handle.bind(bookAppointmentController)));

//TRAINER SLOT ROUTES
router.post("/slots",slotSchema,validate,authorizeRole(["trainer"]),asyncHandler(createBookingSlotController.handle.bind(createBookingSlotController)));
router.get("/slots",authorizeRole(["trainer"]),asyncHandler(getPendingSlotsController.handle.bind(getPendingSlotsController)));
router.delete("/slots/:id",authorizeRole(["trainer"]),asyncHandler(deleteBookingSlotController.handle.bind(deleteBookingSlotController)));
export default router