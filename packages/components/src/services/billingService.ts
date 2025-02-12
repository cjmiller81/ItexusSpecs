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

    createSubscription: async (PriceId: string): Promise<Subscription> => {
        try {
            const { data: session } = await ory.toSession();

            if (!session || !session.identity) {
                throw new Error("User is not authenticated or session is invalid");
            }

            const UserId = session.identity.id;

            const requestData: SubscriptionRequest = {
                UserId,
                PriceId,
            };

            const response = await appAxios.post("/api/billing/subscriptions", requestData, {
                withCredentials: true,
            });

            return response.data as Subscription;
        } catch (error) {
            console.error("Failed to create subscription:", error);
            if (error instanceof AxiosError) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw new Error("Failed to create subscription");
        }
    }

};
