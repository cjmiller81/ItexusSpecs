
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { PlanModel } from "../features/profile/Billing/models/PlanModel";
import { Billing } from "../features/profile/Billing/models/Billing";
import { billingService } from "../services/billingService"; 
import { AxiosError } from "axios";
import { Subscription } from "../features/profile/Billing/models/Subscription";
import { Product } from "../features/profile/Billing/models/Product";

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
  subscriptions: Subscription[] | null;
  product: Product | null;
  products: Product[] | null;
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
  product: null,
  products: null
};

export const attachPaymentMethodAsync = createAsyncThunk<
  any,
  { customerId: string; paymentMethodId: string },
  { rejectValue: string } 
>(
  'billing/attachPaymentMethod',
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

export const detachPaymentMethodAsync = createAsyncThunk<
  any,
  { customerId: string; paymentMethodId: string },
  { rejectValue: string }
>(
  "billing/detachPaymentMethod",
  async ({ customerId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await billingService.detachPaymentMethod(customerId, paymentMethodId);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to detach payment method");
      }
      return rejectWithValue("Failed to detach payment method");
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
        const errorMessage = error.response?.data?.message || error.message;
        return rejectWithValue(errorMessage);
      }

      return rejectWithValue("Failed to update subscription");
    }
  }
);

export const fetchProductAsync = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>(
  "billing/fetchProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const product = await billingService.getProduct(productId);
      return product;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch product details");
    }
  }
);

export const fetchProductsAsync = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>(
  "billing/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const products = await billingService.getProductsList();
      return products;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
      }
      return rejectWithValue("Failed to fetch products");
    }
  }
);

export const cancelSubscriptionAsync = createAsyncThunk<Subscription, { SubscriptionId: string }, { rejectValue: string }>(
  'billing/cancelSubscription',
  async ({ SubscriptionId }, { rejectWithValue }) => {
    try {
      const cancelledSubscription = await billingService.cancelSubscription({ SubscriptionId });
      return cancelledSubscription;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Failed to cancel subscription');
      }
      return rejectWithValue("Failed to cancel subscription");
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


export const getBillingAsync = createAsyncThunk<Billing | null, void, { rejectValue: string }>(
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
    setProduct(state, action) {
      state.product = action.payload;
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
    .addCase(cancelSubscriptionAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(cancelSubscriptionAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.subscription = action.payload;
      state.error = null;
    })
    .addCase(cancelSubscriptionAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
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
      .addCase(getBillingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillingAsync.fulfilled, (state, action: PayloadAction<Billing | null>) => {
        state.loading = false;
        if (action.payload) {
          state.billing = action.payload;
        } else {
          state.billing = null;
        }
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
      .addCase(fetchProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductAsync.fulfilled, (state, action: PayloadAction<Product>) => {
        state.product = action.payload;
      })
      .addCase(fetchProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product details";
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
      })
      .addCase(detachPaymentMethodAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detachPaymentMethodAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.paymentMethods = state.paymentMethods.filter(
          (paymentMethod) => paymentMethod.id !== action.payload.id
        );
      })
      .addCase(detachPaymentMethodAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to detach payment method";
      })
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
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
  setProduct,
} = billingSlice.actions;
