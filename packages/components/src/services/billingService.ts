import { useSelector } from "react-redux";
import { PlanModel } from "../features/profile/Billing/models/PlanModel";
import { appAxios } from "../lib/axios/customAxios";
import { RootState } from "../slices/store";
import { Billing } from "../features/profile/Billing/models/Billing";
import { AxiosError } from "axios";
import { ory } from "../features/auth/lib/sdk";

interface BillingRequest {
    UserId: string;
    Email: string;
}

export const billingService = {
    // Получаем список планов
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

    // Создаем биллинг для пользователя
    createBilling: async (): Promise<Billing> => {
        try {
            // Получаем данные пользователя из сессии Ory
            const { data: session } = await ory.toSession();

            if (!session || !session.identity) {
                throw new Error("User is not authenticated or session is invalid");
            }

            // Извлекаем данные пользователя
            const UserId = session.identity.id;
            const Email = session.identity.traits.email;

            // Формируем запрос
            const requestData: BillingRequest = {
                UserId: UserId,
                Email: Email,
            };

            // Отправляем POST-запрос с данными
            const response = await appAxios.post("/api/billing", requestData, {
                withCredentials: true, // Чтобы передавать куки, если требуется
            });

            return response.data;
        } catch (error) {
            // Обработка ошибок
            console.error("Failed to create billing:", error);
            if (error instanceof AxiosError) {
                throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
            }
            throw new Error("Failed to create billing");
        }
    },
};
