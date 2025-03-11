import { useSelector } from "react-redux";
import { PlanModel } from "../features/profile/Billing/models/PlanModel";
import { appAxios } from "../lib/axios/customAxios";
import { RootState } from "../slices/store";
import { Billing } from "../features/profile/Billing/models/Billing";
import { AxiosError } from "axios";
import { ory } from "../features/auth/lib/sdk";
import { Subscription } from "../features/profile/Billing/models/Subscription";

interface BillingRequest {
    UserId: string;
    Email: string;
}

interface CancelSubscriptionRequest {
    SubscriptionId: string;
  }

interface UpdateSubscriptionRequest {
    SubscriptionId: string;
    SubscriptionItemId: string;
    NewPriceId: string;
}

interface PaymentIntentRequest {
    amount: number;
    currency: string;
    customerId: string;
    description: string;
}

interface SubscriptionRequest {
    UserId: string;
    PriceId: string;
}

export const billingService = {
    getPlans: async (): Promise<PlanModel[]> => {
        try {
            const response = await appAxios.get("/api/billing/plans", {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch billing plans:", error);
            throw new Error("Failed to load billing plans");
        }
    },

    getBilling: async (): Promise<Billing | null> => {
        try {
            const response = await appAxios.get("/api/billing", {
                withCredentials: true,
            });
            return response.data as Billing;
        } catch (error: any) {
            if (error.response?.status === 404) {
                console.warn("Billing not found, returning null");
                return null;
            }
            console.error("Failed to fetch billing:", error);
            throw new Error("Failed to load billing details");
        }
    },

    createBilling: async (): Promise<Billing> => {
        try {
            const { data: session } = await ory.toSession();

            if (!session || !session.identity) {
                throw new Error("User is not authenticated or session is invalid");
            }

            const UserId = session.identity.id;
            const Email = session.identity.traits.email;

            const requestData: BillingRequest = {
                UserId: UserId,
                Email: Email,
            };

            const response = await appAxios.post("/api/billing", requestData, {
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error("Failed to create billing:", error);
            if (error instanceof AxiosError) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw new Error("Failed to create billing");
        }
    },

    createSubscription: async (CustomerId: string, PriceId: string): Promise<Subscription> => {
        try {
            const response = await appAxios.post(
                "/api/billing/subscriptions",
                { CustomerId, PriceId },
                { withCredentials: true }
            );

            return response.data as Subscription;
        } catch (error) {
            console.error("Failed to create subscription:", error);
            if (error instanceof AxiosError) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw new Error("Failed to create subscription");
        }
    },

    createPaymentIntent: async (data: PaymentIntentRequest): Promise<{ clientSecret: string }> => {
        try {
            const response = await appAxios.post(
                "/api/billing/paymentIntent",
                data,
                { withCredentials: true }
            );

            return response.data;
        } catch (error) {
            console.error("Failed to create Payment Intent:", error);
            if (error instanceof AxiosError) {
                throw new Error(
                    error.response?.data?.message || "Failed to create Payment Intent"
                );
            }
            throw new Error("Failed to create Payment Intent");
        }
    },

 updateSubscription : async (data: UpdateSubscriptionRequest): Promise<Subscription> => {
        try {
            const response = await appAxios.post(
                "/api/billing/updateSubscription",
                data,
                { withCredentials: true }
            );
    
            return response.data as Subscription;
        } catch (error) {
            console.error("Failed to update subscription:", error);
    
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || error.message;
                throw new Error(`API Error: ${errorMessage}`);
            }
            
            throw new Error("Failed to update subscription");
        }
    },

    cancelSubscription: async (data: CancelSubscriptionRequest): Promise<Subscription> => {
        try {
            const response = await appAxios.post("/api/billing/cancelSubscription", data, { withCredentials: true });
            return response.data as Subscription;
        } catch (error) {
            console.error("Failed to cancel subscription:", error);
            throw new Error(error instanceof Error ? error.message : 'Failed to cancel subscription');
          }
        },
      
    getPaymentMethods: async (customerId: string): Promise<any[]> => {
        try {
            const response = await appAxios.get(`/api/billing/paymentMethods`, {
                params: { customerId },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch payment methods:", error);
            if (error instanceof AxiosError) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw new Error("Failed to load payment methods");
        }
    },

    attachPaymentMethod: async (customerId: string, paymentMethodId: string): Promise<any> => {
        try {
            const response = await appAxios.post(
                "/api/billing/attach",
                { CustomerId: customerId, PaymentMethodId: paymentMethodId },
                { withCredentials: true }
            );

            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    success: false,
                    message: error.response?.data?.message || error.message,
                    status: error.response?.status || 'unknown'
                };
            }
    
            return {
                success: false,
                message: "Failed to attach payment method",
                status: 'unknown'
            };
        }
    },

    setDefaultPaymentMethod: async (customerId: string, paymentMethodId: string): Promise<any> => {
        try {
            const response = await appAxios.post(
                "/api/billing/setDefaultPaymentMethod",
                { CustomerId: customerId, PaymentMethodId: paymentMethodId },
                { withCredentials: true }
            );

            return response.data;
        } catch (error) {
            console.error("Failed to set default payment method:", error);
            if (error instanceof AxiosError) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw new Error("Failed to set default payment method");
        }
    },

    getSubscriptions: async (customerId: string): Promise<Subscription[]> => {
        try {
            const response = await appAxios.get("/api/billing/subscriptions", {
                params: { customerId },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch subscriptions:", error);
            if (error instanceof AxiosError) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw new Error("Failed to load subscriptions");
        }
    },

    handleWebhook: async (webhookData: any): Promise<void> => {
        try {
            await appAxios.post("/api/billing/webhook", webhookData, {
                withCredentials: true,
            });
        } catch (error) {
            console.error("Failed to process webhook event:", error);
            if (error instanceof AxiosError) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw new Error("Failed to process webhook event");
        }
    },

    detachPaymentMethod: async (customerId: string, paymentMethodId: string): Promise<any> => {
        try {
          const response = await appAxios.post(
            "/api/billing/detachPaymentMethod",
            { CustomerId: customerId, PaymentMethodId: paymentMethodId },
            { withCredentials: true }
          );
          return response.data;
        } catch (error) {
          console.error("Failed to detach payment method:", error);
          if (error instanceof AxiosError) {
            throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
          }
          throw new Error("Failed to detach payment method");
        }
      },

};
