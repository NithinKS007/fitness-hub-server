import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { AuthenticationStatusMessage, SubscriptionStatusMessage } from "../../shared/constants/httpResponseStructure";
import stripe from "../config/stripeConfig";

const createProduct = async (name: string, description: string): Promise<string> => {
    try {
        const product = await stripe.products.create({ name, description });
        return product.id;
    } catch (error) {
        console.log("Error creating product:", error);
        throw new validationError("Failed to create product in stripe service");
    }
}

const createPrice = async (productId: string, amount: number, currency: string, interval: "year" | "month", 
intervalCount: number
): Promise<string> => {
    try {
        const price = await stripe.prices.create({
            product: productId,
            unit_amount: amount, 
            currency,
            recurring: { interval, interval_count: intervalCount },
        });
        return price.id;
    } catch (error) {
        console.log("Error creating price:", error);
        throw new validationError("Failed to create stripe service");
    }
}

const deactivatePrice =  async (priceId: string):Promise<void>  =>  {
    await stripe.prices.update(priceId, { active: false });
}

const createSubscriptionSession = async ({stripePriceId,userId,trainerId,subscriptionId}:
    {stripePriceId:string,userId:string,trainerId:string,subscriptionId:string}):Promise<{sessionId:string}> => { 

    try {
        const productionUrl = process.env.CLIENT_ORIGINS;
        const successUrl =    `/${process.env.STRIPE_SUCCESS_URL}`
        const failureUrl =    `/${process.env.STRIPE_FAILURE_URL}`
        const session = await stripe.checkout.sessions.create({

            payment_method_types:["card"],
            line_items:[
                {
                    price:stripePriceId,
                    quantity:1
                }
            ],
            mode:"subscription",
            success_url:`${productionUrl}${successUrl}`,
            cancel_url:`${productionUrl}${failureUrl}`,
            client_reference_id:userId.toString(),
            metadata:{
                subscriptionId: subscriptionId.toString(),
                trainerId: trainerId.toString(),
            }
        })
        return {sessionId:session.id}

    } catch (error) {
        console.log("error occured in stripe service layer",error);
        throw new validationError(SubscriptionStatusMessage.FailedToCreateSubscriptionSession)
    }
}

const  getCheckoutSession = async(sessionId: string) => {
    if (!sessionId) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      throw new validationError(SubscriptionStatusMessage.InvalidSessionIdForStripe);
    }
    return session;
}

const getSubscription  = async(stripeSubscriptionId: string) => {
    if (!stripeSubscriptionId) {
        throw new validationError(AuthenticationStatusMessage.InvalidId);
    }
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    if (!subscription) {
    throw new validationError(AuthenticationStatusMessage.InvalidId);
    }
    return subscription;
}

const cancelSubscription = async(stripeSubscriptionId: string) => {

    if(!stripeSubscriptionId){
        throw new validationError(AuthenticationStatusMessage.InvalidId)
    }
    const canceledSub = await stripe.subscriptions.cancel(stripeSubscriptionId);
    return canceledSub
}

const getSubscriptionsData = async (stripeSubscriptionId: string) =>{
    const stripeSub = await getSubscription(stripeSubscriptionId)
    return {
        startDate: new Date(stripeSub.current_period_start * 1000).toISOString().split("T")[0],
        endDate: new Date(stripeSub.current_period_end * 1000).toISOString().split("T")[0],
        isActive: stripeSub.status,
        stripeSubscriptionStatus: stripeSub.status,
      };
}


export { createProduct, createPrice ,deactivatePrice,createSubscriptionSession,getCheckoutSession,getSubscription,cancelSubscription ,getSubscriptionsData};
