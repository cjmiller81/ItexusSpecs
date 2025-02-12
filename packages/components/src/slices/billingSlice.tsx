import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { PlanModel } from "../features/profile/Billing/models/PlanModel";
import { Billing } from "../features/profile/Billing/models/Billing";
import { billingService } from "../services/billingService"; 
import { AxiosError } from "axios";

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


