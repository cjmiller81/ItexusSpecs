
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
  paymentIntentClientSecret: string | null;
  paymentMethods: any[];
  customerId: string | null;
  subscriptions: Subscription[] | null
}
interface PaymentIntentRequest {
  amount: number;
  currency: string;
  customerId: string;
  description: string;
}

const initialState: BillingState = {
  plans: [],
  billing: null,
  loading: false,
  error: null,
  subscription: null,
  subscriptions: null,
  defaultSourceId: null,
  paymentIntentClientSecret: null,
  paymentMethods: [],
  customerId: null,
};

export const attachPaymentMethodAsync = createAsyncThunk<
  any,
  { customerId: string; paymentMethodId: string },
  { rejectValue: string }
>(
  "billing/attachPaymentMethod",
  async ({ customerId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await billingService.attachPaymentMethod(customerId, paymentMethodId);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to attach payment method");
      }
      return rejectWithValue("Failed to attach payment method");
    }
  }
);

export const handleWebhookEventAsync = createAsyncThunk<
  any,
  { eventType: string; eventData: any },
  { rejectValue: string }
>(
  "billing/handleWebhookEvent",
  async ({ eventType, eventData }, { rejectWithValue }) => {
    try {
      switch (eventType) {
        case "invoice.payment_succeeded":
          return await billingService.updateSubscription(eventData.subscriptionId);
        case "invoice.payment_failed":
          return await billingService.updateSubscription(eventData.subscriptionId);
        case "customer.subscription.updated":
          return await billingService.getSubscriptions(eventData.subscriptionId);
          case "payment_intent.created":
          return await billingService.createPaymentIntent({
            amount: eventData.amount,
            currency: eventData.currency,
            customerId: eventData.customerId,
            description: eventData.description,
          });
        default:
          return rejectWithValue("Unhandled event type");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to process webhook event");
      }
      return rejectWithValue("Failed to process webhook event");
    }
  }
);

export const updateSubscriptionAsync = createAsyncThunk<
  Subscription,
  { SubscriptionId: string; SubscriptionItemId: string; NewPriceId: string },
  { rejectValue: string }
>(
  "billing/updateSubscription",
  async ({ SubscriptionId, SubscriptionItemId, NewPriceId }, { rejectWithValue }) => {
    try {
      const updatedSubscription = await billingService.updateSubscription({
        SubscriptionId,
        SubscriptionItemId,
        NewPriceId,
      });
      return updatedSubscription;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to update subscription");
      }
      return rejectWithValue("Failed to update subscription");
    }
  }
);

export const fetchSubscriptionsAsync = createAsyncThunk<
  Subscription[],
  string,
  { rejectValue: string }
>(
  "billing/fetchSubscriptions",
  async (customerId, { rejectWithValue }) => {
    try {
      const subscriptions = await billingService.getSubscriptions(customerId);
      return subscriptions;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch subscriptions");
      }
      return rejectWithValue("Failed to fetch subscriptions");
    }
  }
);

export const fetchPaymentMethodsAsync = createAsyncThunk<
  any[],
  string, 
  { rejectValue: string }
>(
  "billing/fetchPaymentMethods",
  async (customerId, { rejectWithValue }) => {
    try {
      const paymentMethods = await billingService.getPaymentMethods(customerId);
      return paymentMethods;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch payment methods");
      }
      return rejectWithValue("Failed to fetch payment methods");
    }
  }
);

export const createPaymentIntentAsync = createAsyncThunk<
  { clientSecret: string },
  PaymentIntentRequest,
  { rejectValue: string }
>(
  "billing/createPaymentIntent",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await billingService.createPaymentIntent(requestData);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to create Payment Intent");
      }
      return rejectWithValue("Failed to create Payment Intent");
    }
  }
);

export const setDefaultPaymentMethodAsync = createAsyncThunk<
  any,
  { customerId: string; paymentMethodId: string },
  { rejectValue: string }
>(
  "billing/setDefaultPaymentMethod",
  async ({ customerId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await billingService.setDefaultPaymentMethod(customerId, paymentMethodId);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to set default payment method");
      }
      return rejectWithValue("Failed to set default payment method");
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

export const createSubscriptionAsync = createAsyncThunk<
  any,
  { CustomerId: string; PriceId: string },
  { rejectValue: string }
>(
  "billing/createSubscription",
  async ({ CustomerId, PriceId }, { rejectWithValue }) => {
    try {
      const subscription = await billingService.createSubscription(CustomerId, PriceId);
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
    .addCase(attachPaymentMethodAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(attachPaymentMethodAsync.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.paymentMethods.push(action.payload);
    })
    .addCase(attachPaymentMethodAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to attach payment method";
    })
    builder
    .addCase(setDefaultPaymentMethodAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(setDefaultPaymentMethodAsync.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.defaultSourceId = action.payload.defaultSourceId;
    })
    .addCase(setDefaultPaymentMethodAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to set default payment method";
    })
    .addCase(updateSubscriptionAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateSubscriptionAsync.fulfilled, (state, action: PayloadAction<Subscription>) => {
      state.loading = false;
      state.subscription = action.payload;
    })
    .addCase(updateSubscriptionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update subscription";
    })
    .addCase(fetchSubscriptionsAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchSubscriptionsAsync.fulfilled, (state, action: PayloadAction<Subscription[]>) => {
      state.loading = false;
      state.subscriptions = action.payload;
    })
    .addCase(fetchSubscriptionsAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch subscriptions";
    })
    .addCase(fetchPaymentMethodsAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchPaymentMethodsAsync.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.paymentMethods = action.payload;
    })
    .addCase(fetchPaymentMethodsAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch payment methods";
    })
      .addCase(fetchPlansAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlansAsync.fulfilled, (state, action: PayloadAction<PlanModel[]>) => {
        state.loading = false;
        state.plans = action.payload;
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
