import Stripe from "stripe";
import { cancelSubscriptionDTO, CheckSubscriptionStatus, IdDTO, PurchaseSubscriptionDTO, updateSubscriptionBlockStatus, updateSubscriptionDetails } from "../../application/dtos";
import stripe from "../../infrastructure/config/stripe";
import { SubPeriod } from "../../infrastructure/databases/models/subscriptionModel";
import { createPrice, createProduct, createSubscriptionSession, deactivatePrice } from "../../infrastructure/services/stripeServices";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { Subscription } from "../entities/subscriptionEntity";
import { SubscriptionRepository } from "../interfaces/subscriptionRepository";
import { TrainerRepository } from "../interfaces/trainerRepository";
import { UserSubscriptionPlanRepository } from "../interfaces/userSubscriptionRepository";
import { SubscriptionPlanEntity } from "../entities/userSubscriptionPlanEntity";

export class SubscriptionUseCase {

    constructor(private subscriptionRepository:SubscriptionRepository,private trainerRepository:TrainerRepository,private userSubscriptionPlanRepository:UserSubscriptionPlanRepository) {}

    public async createSubscription(data:{trainerId: string;subPeriod: SubPeriod;price: number;durationInWeeks: number;sessionsPerWeek: number;totalSessions: number;}):Promise<Subscription> {

        const {trainerId,subPeriod,totalSessions,price} = data
        const existing = await this.subscriptionRepository.findExistingSubscription({trainerId,subPeriod})

        const trainerData = await this.trainerRepository.getTrainerDetailsById(trainerId)

        if(existing){
            throw new validationError(HttpStatusMessages.SubscriptionAlreadyExists)
        }
        const getIntervalCount = (subPeriod: SubPeriod): number => {
            if (subPeriod === 'quarterly') {
              return 3; 
            } else if (subPeriod === 'halfYearly') {
              return 6;  
            } else if (subPeriod === 'yearly') {
              return 1;  
            } else {
              return 1;
            }
          };
          
          
          const getInterval = (subPeriod: SubPeriod): 'month' | 'year' => {
            return subPeriod === 'yearly' ? 'year' : 'month';
          }
        
          const interval = getInterval(subPeriod)
          const intervalCount = getIntervalCount(subPeriod)
          const productId = await createProduct(
            `${subPeriod.charAt(0).toUpperCase() + subPeriod.slice(1).toLowerCase()} Fitness Plan`,
            `Trainer: ${trainerData.fname} ${trainerData.lname}, ${totalSessions} sessions, Email: ${trainerData.email}`
          );              
        const stripePriceId = await createPrice(productId, price * 100, 'usd', interval, intervalCount)
        return await this.subscriptionRepository.createSubscription({...data,stripePriceId:stripePriceId})
    }

    public async getTrainerSubscriptions(data:IdDTO):Promise<Subscription[]> {
        if(!data){
            throw new validationError(HttpStatusMessages.IdRequired)
        }
        return await this.subscriptionRepository.findAllSubscription(data)
    }

    public async updateSubscriptionBlockStatus(data:updateSubscriptionBlockStatus):Promise<Subscription>{
        if(!data){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        
        const subscriptionData = await this.subscriptionRepository.findSubscriptionById(data._id)
        
        if(!subscriptionData){
            throw new validationError(HttpStatusMessages.InvalidId)
        }

        const updatedSubscriptionData = await this.subscriptionRepository.updateBlockStatus(data)

        if(!updatedSubscriptionData){
            throw new validationError(HttpStatusMessages.FailedToUpdateBlockStatus)
        }

        return updatedSubscriptionData
    }
    public async editSubscription(data:updateSubscriptionDetails):Promise<Subscription>{

        const {trainerId,subPeriod,totalSessions,price} = data
        if(!data){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }

        const subscriptionData = await this.subscriptionRepository.findSubscriptionById(data._id)

        if(!subscriptionData){
            throw new validationError(HttpStatusMessages.InvalidId)
        }
        // const existing = await this.subscriptionRepository.findExistingSubscription({trainerId,subPeriod})

        // if(existing){
        //     throw new validationError(HttpStatusMessages.SubscriptionAlreadyExists)
        // }

        const existingSubData = await this.subscriptionRepository.findSubscriptionById(data._id)

        const trainerData = await this.trainerRepository.getTrainerDetailsById(trainerId)

        let updatedSubscriptionData
        if(data.subPeriod!== existingSubData?.subPeriod|| data.price!==existingSubData?.price || data.totalSessions!==existingSubData?.totalSessions) {
            const productId = await createProduct(
                `${subPeriod.charAt(0).toUpperCase() + subPeriod.slice(1).toLowerCase()} Fitness Plan`,
                `Trainer: ${trainerData?.fname} ${trainerData?.lname}, ${totalSessions} sessions, Email: ${trainerData?.email}`
              ); 
            const getIntervalCount = (subPeriod: SubPeriod): number => {
            if (subPeriod === 'quarterly') {
                return 3; 
            } else if (subPeriod === 'halfYearly') {
                return 6;  
            } else if (subPeriod === 'yearly') {
                return 1;  
            } else {
                return 1;
            }
            };
            
            const getInterval = (subPeriod: SubPeriod): 'month' | 'year' => {
            return subPeriod === 'yearly' ? 'year' : 'month';
            }

            const interval = getInterval(subPeriod)
            const intervalCount = getIntervalCount(subPeriod)
            const stripePriceId = await createPrice(productId, price * 100, 'usd', interval, intervalCount)
            updatedSubscriptionData = await this.subscriptionRepository.editSubscription({...data,stripePriceId:stripePriceId})
        }
        
        updatedSubscriptionData = await this.subscriptionRepository.editSubscription({...data})
        if(!updatedSubscriptionData){
            throw new validationError(HttpStatusMessages.FailedToUpdateBlockStatus)
        }
        return updatedSubscriptionData
    }

    public async deleteSubscription(data:IdDTO):Promise<Subscription>{
        if(!data){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        const subscriptionData = await this.subscriptionRepository.findSubscriptionById(data)

        if(!subscriptionData){
            throw new validationError(HttpStatusMessages.InvalidId)
        }
        const stripePriceId = subscriptionData.stripePriceId
        if(stripePriceId){
            await deactivatePrice(stripePriceId)
        }
        const deletedSubscription = await this.subscriptionRepository.deletedSubscription(data)

        if(!deletedSubscription){
            throw new validationError(HttpStatusMessages.FailedToDelete)
        }
        return deletedSubscription
    }

    public async createStripeSession(data:PurchaseSubscriptionDTO):Promise<string> {
        const {userId,subscriptionId} = data
        const subscriptionData = await this.subscriptionRepository.findSubscriptionById(subscriptionId)
        if(!subscriptionData){
            throw new validationError(HttpStatusMessages.FailedToRetrieveSubscriptionDetails)
        }

        if(subscriptionData.isBlocked){
            throw new validationError(HttpStatusMessages.SubscriptionBlockedUnavailabe)
        }
        const sessionId = await createSubscriptionSession({stripePriceId:subscriptionData.stripePriceId,userId:userId,trainerId:subscriptionData.trainerId.toString(),subscriptionId:subscriptionData._id.toString()})
        if(!sessionId){
            throw new validationError(HttpStatusMessages.FailedToCreateSubscriptionSession)
        }
        return sessionId.sessionId
    }


    public async webHookHandler(sig:any,webhookSecret:any,body:any):Promise<void> {

        if(!sig || !webhookSecret || !body) {
            throw new validationError(HttpStatusMessages.WebHookCredentialsMissing)
        }
        const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        if(!event){
            throw new validationError(HttpStatusMessages.WebHookVerificationFailed)
        }
        switch (event.type){
            case "checkout.session.completed":
             const session = event?.data?.object
             const userId = session?.client_reference_id
             if(session?.metadata){
                const subscriptionId = session.metadata?.subscriptionId 
                const trainerId = session?.metadata?.trainerId 
                 const stripeSubscriptionId = session?.subscription as string
                 const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
                 
                if (!subscriptionId || !trainerId) {
                    throw new validationError(HttpStatusMessages.SubscriptionIdAndTraineIdMissing);
                }
                const subscriptionData = await this.subscriptionRepository.findSubscriptionById(subscriptionId)
                if (!subscriptionData) {
                    throw new validationError(HttpStatusMessages.FailedToRetrieveSubscriptionDetails);
                }
                const newSubscriptionAdding = {
                    userId:userId as string,
                    trainerId:trainerId,
                    subPeriod:subscriptionData?.subPeriod,
                    price:subscriptionData?.price,
                    durationInWeeks:subscriptionData?.durationInWeeks,
                    sessionsPerWeek:subscriptionData?.sessionsPerWeek,
                    totalSessions:subscriptionData?.totalSessions,
                    stripePriceId:subscriptionData?.stripePriceId,
                    stripeSubscriptionId:stripeSubscriptionId as string,
                    stripeSubscriptionStatus:subscription.status
                  }
                await this.userSubscriptionPlanRepository.create(newSubscriptionAdding)
                console.log(`Subscription ${subscriptionId} successful in webhook handler`);
             } 

             break
             case "invoice.payment_failed":

             const invoice = event.data.object
             const stripeSubscriptionId = invoice.subscription as string

             if(stripeSubscriptionId){
                await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionIdAndUpdateStatus({stripeSubscriptionId,status:"canceled"})
                console.log(`Subscription ${stripeSubscriptionId} cancelled due to payment failure`);
             }

             break
             case "customer.subscription.deleted":

             const subscription = event.data.object
             await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionIdAndUpdateStatus({stripeSubscriptionId:subscription.id,status:"canceled"})
             console.log(`Subscription ${subscription.id} cancelled due to customer cancellation`);
             break
             default:
            console.log(`Unhandled event type: ${event.type}`);
        }
    }

    public async getSubscriptionDetailsBySessionId(data:string):Promise<SubscriptionPlanEntity & { isSubscribed: boolean }> {
        if(!data){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        const session = await stripe.checkout.sessions.retrieve(data)
        if(!session){
            throw new validationError(HttpStatusMessages.InvalidSessionIdForStripe)
        }
            const stripeSubscriptionId = session.subscription
            const userTakenSubscription = await this.userSubscriptionPlanRepository.findSubscriptionByStripeSubscriptionId(stripeSubscriptionId as string)
            if (!userTakenSubscription) {
                throw new validationError(HttpStatusMessages.FailedToRetrieveSubscriptionDetails);
            }
            const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId as string);
            const subscriptionStatus = stripeSubscription.status === 'active' && userTakenSubscription.stripeSubscriptionStatus==="active"

            return {...userTakenSubscription,isSubscribed:subscriptionStatus}
   
        
    }

    public async getUserSubscriptionsData(data:IdDTO):Promise<any> {

        if(!data){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        const userSubscriptionsData = await this.userSubscriptionPlanRepository.findSubscriptionsOfUser(data)
        if(!userSubscriptionsData){
            throw new validationError(HttpStatusMessages.FailedToRetrieveSubscriptionDetails)
        }

        const result = await Promise.all(userSubscriptionsData.map(async (sub) => {
            const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
            const stripeData = {
              startDate: new Date(stripeSub.current_period_start * 1000).toISOString().split("T")[0],
              endDate: new Date(stripeSub.current_period_end * 1000).toISOString().split("T")[0],
              isActive: stripeSub.status
            }

            return {
              ...sub, 
              ...stripeData,
            };
          }));
        
          return result;
    }
    public async getTrainerSubscribedUsers(data:IdDTO):Promise<any[]> {

        if(!data){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        const userSubscriptionsData = await this.userSubscriptionPlanRepository.findSubscriptionsOfTrainer(data)
        if(!userSubscriptionsData){
            throw new validationError(HttpStatusMessages.FailedToRetrieveSubscriptionDetails)
        }

        const result = await Promise.all(userSubscriptionsData.map(async (sub) => {
            const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
            const stripeData = {
              startDate: new Date(stripeSub.current_period_start * 1000).toISOString().split("T")[0],
              endDate: new Date(stripeSub.current_period_end * 1000).toISOString().split("T")[0],
              isActive: stripeSub.status
            }

            return {
              ...sub, 
              ...stripeData,
            };
          }));
        
          return result;
    }

    public async cancelSubscription(data: cancelSubscriptionDTO): Promise<{stripeSubscriptionId:string,isActive:string,cancelAction:string}> {
        if (!data) {
          throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
        }
        const { stripeSubscriptionId, action } = data;

        const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

        if(!stripeSub){
            throw new validationError(HttpStatusMessages.InvalidId)
        }
        if (action === 'cancelImmediately') {
        const stripeSub:any = await stripe.subscriptions.cancel(stripeSubscriptionId)
        return {
            stripeSubscriptionId :stripeSub.id,
            isActive:stripeSub.status,
            cancelAction:action
          }
        } else {

        throw new validationError('Invalid cancellation action');
        
        }
    }
    public async isUserSubscribedToTheTrainer(data: CheckSubscriptionStatus): Promise<{trainerId:string,isSubscribed:boolean}> {
        if (!data) {
          throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
        }

        const {_id,trainerId} = data

        const subscriptionData = await this.userSubscriptionPlanRepository.findSubscriptionsOfUserwithUserIdAndTrainerId({_id,trainerId})
        if (subscriptionData && subscriptionData.length > 0) {
            for (const sub of subscriptionData) {
                try {
                    const stripeSubscription = await stripe.subscriptions.retrieve(
                        sub.stripeSubscriptionId
                    );
                    if (stripeSubscription.status === "active" && sub.stripeSubscriptionStatus === "active") {
                        return {
                            trainerId: trainerId,
                            isSubscribed: true
                        };
                    }
                } catch (error) {
                    console.error(`Error checking subscription ${sub.stripeSubscriptionId}:`, error);
                }
            }
        }
        return {
            trainerId: trainerId,
            isSubscribed: false
        };
    }
   
}