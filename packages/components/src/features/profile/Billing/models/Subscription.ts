export type SubscriptionItem = {
    id: string;
    object: string;
    billing_thresholds: any | null;
    created: number;
    discounts: any[];
    metadata: any;
    plan: Plan;
    price: Price;
    quantity: number;
    subscription: string;
    tax_rates: any[];
};

export type Plan = {
    id: string;
    object: string;
    active: boolean;
    aggregate_usage: any | null;
    amount: number;
    amount_decimal: string;
    billing_scheme: string;
    created: number;
    currency: string;
    interval: string;
    interval_count: number;
    livemode: boolean;
    metadata: any;
    meter: any | null;
    nickname: string | null;
    product: string;
    tiers_mode: any | null;
    transform_usage: any | null;
    trial_period_days: any | null;
    usage_type: string;
};

export type Price = {
    id: string;
    object: string;
    active: boolean;
    billing_scheme: string;
    created: number;
    currency: string;
    custom_unit_amount: any | null;
    livemode: boolean;
    lookup_key: any | null;
    metadata: any;
    nickname: string | null;
    product: string;
    recurring: Recurring;
    tax_behavior: string;
    tiers_mode: any | null;
    transform_quantity: any | null;
    type: string;
    unit_amount: number;
    unit_amount_decimal: string;
};

export type Recurring = {
    aggregate_usage: any | null;
    interval: string;
    interval_count: number;
    meter: any | null;
    trial_period_days: any | null;
    usage_type: string;
};

export type AutomaticTax = {
    disabled_reason: any | null;
    enabled: boolean;
    liability: any | null;
};

export type CancellationDetails = {
    comment: any | null;
    feedback: any | null;
    reason: any | null;
};

export type InvoiceSettings = {
    account_tax_ids: any | null;
    issuer: Issuer;
};

export type Issuer = {
    type: string;
};

export type PaymentSettings = {
    payment_method_options: any | null;
    payment_method_types: any | null;
    save_default_payment_method: string;
};

export type Subscription = {
    id: string;
    object: string;
    application: any | null;
    application_fee_percent: any | null;
    automatic_tax: AutomaticTax;
    billing_cycle_anchor: number;
    billing_cycle_anchor_config: any | null;
    billing_thresholds: any | null;
    cancel_at: any | null;
    cancel_at_period_end: boolean;
    canceled_at: any | null;
    cancellation_details: CancellationDetails;
    collection_method: string;
    created: number;
    currency: string;
    current_period_end: number;
    current_period_start: number;
    customer: string;
    days_until_due: any | null;
    default_payment_method: any | null;
    default_source: any | null;
    default_tax_rates: any[];
    description: any | null;
    discount: any | null;
    discounts: any[];
    ended_at: any | null;
    invoice_settings: InvoiceSettings;
    items: {
        object: string;
        data: SubscriptionItem[];
        has_more: boolean;
        total_count: number;
        url: string;
    };
    latest_invoice: string;
    livemode: boolean;
    metadata: any;
    next_pending_invoice_item_invoice: any | null;
    on_behalf_of: any | null;
    pause_collection: any | null;
    payment_settings: PaymentSettings;
    pending_invoice_item_interval: any | null;
    pending_setup_intent: any | null;
    pending_update: any | null;
    plan: Plan;
    quantity: number;
    schedule: any | null;
    start_date: number;
    status: string;
    test_clock: any | null;
    transfer_data: any | null;
    trial_end: any | null;
    trial_settings: TrialSettings;
    trial_start: any | null;
};

export type TrialSettings = {
    end_behavior: EndBehavior;
};

export type EndBehavior = {
    missing_payment_method: string;
};
