import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { PlanModel } from "../features/profile/Billing/models/PlanModel";
import { Billing } from "../features/profile/Billing/models/Billing";
import { billingService } from "../services/billingService"; 
import { AxiosError } from "axios";
import { Subscription } from "../features/profile/Billing/models/Subscription";

export interface BillingState {
  plans: PlanModel[];
  billing: Billing | null;
  loading: boolean;
  error: string | null;
  subscription: Subscription | null;
}

const initialState: BillingState = {
  plans: [],
  billing: null,
  loading: false,
  error: null,
  subscription: null,
};


export const fetchPlansAsync = createAsyncThunk<PlanModel[], void, { rejectValue: string }>(
  "billing/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const plans = await billingService.getPlans();
      return plans;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch billing plans");
      }
      return rejectWithValue("Failed to fetch billing plans");
    }
  }
);

export const createBillingAsync = createAsyncThunk<Billing, void, { rejectValue: string }>(
  "billing/createBilling",
  async (_, { rejectWithValue }) => {
    try {
      const billing = await billingService.createBilling();
      return billing;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to create billing");
      }
      return rejectWithValue("Failed to create billing");
    }
  }
);

export const createSubscriptionAsync = createAsyncThunk<any, string, { rejectValue: string }>(
  "billing/createSubscription",
  async (PriceId, { rejectWithValue }) => {
    try {
      const subscription = await billingService.createSubscription(PriceId);
      return subscription;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to create subscription");
      }
      return rejectWithValue("Failed to create subscription");
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
    createBillingRequest(state) {
      state.loading = true;
      state.error = null;
    },
    createBillingSuccess(state, action: PayloadAction<Billing>) {
      state.loading = false;
      state.billing = action.payload;
    },
    createBillingFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createSubscriptionRequest(state) {
      state.loading = true;
      state.error = null;
    },
    createSubscriptionSuccess(state, action: PayloadAction<Subscription>) {
      state.loading = false;
      state.subscription = action.payload;
    },
    createSubscriptionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlansAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlansAsync.fulfilled, (state, action: PayloadAction<PlanModel[]>) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(createBillingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBillingAsync.fulfilled, (state, action: PayloadAction<Billing>) => {
        state.loading = false;
        state.billing = action.payload;
      })
      .addCase(createSubscriptionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscriptionAsync.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.loading = false;
        state.subscription = action.payload;
      })
  },
});

export const { 
  fetchPlansRequest, 
  fetchPlansSuccess, 
  fetchPlansFailure,
  createBillingRequest,
  createBillingSuccess,
  createBillingFailure
} = billingSlice.actions;


