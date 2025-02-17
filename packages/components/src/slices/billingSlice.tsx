
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
  defaultSourceId: string | null;
  paymentIntentClientSecret: string | null; // Добавим для хранения clientSecret
}

const initialState: BillingState = {
  plans: [],
  billing: null,
  loading: false,
  error: null,
  subscription: null,
  defaultSourceId: null,
  paymentIntentClientSecret: null, // Начальное значение
};

// Асинхронный экшен для создания PaymentIntent
export const createPaymentIntentAsync = createAsyncThunk<
  { clientSecret: string },
  string, // customerId
  { rejectValue: string }
>(
  "billing/createPaymentIntent",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await billingService.createPaymentIntent(customerId);
      return response; // Возвращаем clientSecret
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to create Payment Intent");
      }
      return rejectWithValue("Failed to create Payment Intent");
    }
  }
);

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

export const getBillingAsync = createAsyncThunk<Billing, void, { rejectValue: string }>(
  "billing/fetchBilling",
  async (_, { rejectWithValue }) => {
    try {
      const billing = await billingService.getBilling();
      return billing;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch billing");
      }
      return rejectWithValue("Failed to fetch billing");
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
    // Добавляем новый редьюсер для сохранения clientSecret
    createPaymentIntentSuccess(state, action: PayloadAction<{ clientSecret: string }>) {
      state.paymentIntentClientSecret = action.payload.clientSecret;
    },
    createPaymentIntentFailure(state, action: PayloadAction<string>) {
      state.paymentIntentClientSecret = null;
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
      .addCase(getBillingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillingAsync.fulfilled, (state, action: PayloadAction<Billing>) => {
        state.loading = false;
        state.billing = action.payload;
        state.defaultSourceId = action.payload.defaultSourceId || null;
      })
      .addCase(getBillingAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch billing details";
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
      // Обрабатываем создание PaymentIntent
      .addCase(createPaymentIntentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntentAsync.fulfilled, (state, action: PayloadAction<{ clientSecret: string }>) => {
        state.loading = false;
        state.paymentIntentClientSecret = action.payload.clientSecret;
      })
      .addCase(createPaymentIntentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create Payment Intent";
      });
  },
});

export const { 
  fetchPlansRequest, 
  fetchPlansSuccess, 
  fetchPlansFailure,
  createBillingRequest,
  createBillingSuccess,
  createBillingFailure,
  createPaymentIntentSuccess,
  createPaymentIntentFailure,
} = billingSlice.actions;
