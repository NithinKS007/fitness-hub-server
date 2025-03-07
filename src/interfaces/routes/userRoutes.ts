import express from "express"
import { authenticate } from "../middlewares/authenticate"
import { UserController } from "../../application/controllers/userController"
import { SubscriptionController } from "../../application/controllers/subscriptionController"

const userRoutes = express.Router()
userRoutes.get("/trainers",UserController.getApprovedTrainers)
userRoutes.get("/trainers/:_id",UserController.getApprovedTrainerDetailsWithSub)
userRoutes.post("/checkout-subscription-session/",authenticate,SubscriptionController.purchaseSubscription)
userRoutes.get("/subscriptions",authenticate,UserController.getUserSubscriptions)
userRoutes.get("/verify-subscriptions/:sessionId",authenticate,SubscriptionController.getSubscriptionDetailsBySessionId)
userRoutes.patch("/cancel-subscriptions",authenticate,SubscriptionController.cancelSubscription)
userRoutes.get("/trainer-suggestions",UserController.autoSuggestionWithTrainers)

// USER PROFILE ROUTE
userRoutes.put("/update-profile",authenticate,UserController.updateUserProfile)

export default userRoutes