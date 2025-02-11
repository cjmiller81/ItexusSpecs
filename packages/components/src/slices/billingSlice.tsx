import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { PlanModel } from "../features/profile/Billing/models/PlanModel";
import { Billing } from "../features/profile/Billing/models/Billing";
import { appAxios } from "../lib/axios/customAxios";
import { ory } from "../features/auth/lib/sdk";

interface BillingRequest {
    UserId: string;
    Email: string;
}

export interface BillingState {
    plans: PlanModel[];
    billing: Billing | null;
    loading: boolean;
    error: string | null;
}

const initialState: BillingState = {
    plans: [],
    billing: null,
    loading: false,
    error: null,
};

export const createBillingAsync = createAsyncThunk<Billing, void, {}>(
    "billing/createBilling",
    async (_, { rejectWithValue }) => {
        try {
            const { data: session } = await ory.toSession();
            if (!session || !session.identity) {
                throw new Error("User is not authenticated or session is invalid");
            }

            const requestData: BillingRequest = {
                UserId: session.identity.id,
                Email: session.identity.traits.email,
            };

            const response = await appAxios.post("/api/billing", requestData, {
                withCredentials: true,
            });

            return response.data;
        } catch (error: any) {
            console.error("Failed to create billing:", error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const billingSlice = createSlice({
    name: "billing",
    initialState,
    reducers: {
        fetchPlansRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchPlansSuccess(state, action: PayloadAction<PlanModel[]>) {
            state.loading = false;
            state.plans = action.payload;
        },
        fetchPlansFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBillingAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBillingAsync.fulfilled, (state, action: PayloadAction<Billing>) => {
                state.loading = false;
                state.billing = action.payload;
            })
            .addCase(createBillingAsync.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { fetchPlansRequest, fetchPlansSuccess, fetchPlansFailure } = billingSlice.actions;
export default billingSlice.reducer;
