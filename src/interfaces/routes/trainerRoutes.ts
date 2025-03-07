import express from "express"
import { SubscriptionController } from "../../application/controllers/subscriptionController"
import { authenticate } from "../middlewares/authenticate"
import { TrainerController } from "../../application/controllers/trainerController"
const trainerRoutes = express.Router()

// SUBSCRIPTION ROUTES
trainerRoutes.post("/add-subscription",authenticate,SubscriptionController.addSubscription)
trainerRoutes.get("/subscriptions",authenticate,SubscriptionController.getTrainerSubscriptions)
trainerRoutes.patch("/subscriptions/:_id",authenticate,SubscriptionController.updateSubscriptionBlockStatus)
trainerRoutes.put("/subscriptions/:_id",authenticate,SubscriptionController.editSubscription)
trainerRoutes.delete("/subscriptions/:_id",authenticate,SubscriptionController.deleteSubscription)
trainerRoutes.get("/subscribers",authenticate,TrainerController.getTrainerSubscribedUsers)

// PROFILE UPDATION ROUTES
trainerRoutes.put("/update-profile",authenticate,TrainerController.updateTrainerProfile)


export default trainerRoutes