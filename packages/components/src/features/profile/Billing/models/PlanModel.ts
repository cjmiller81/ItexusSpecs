export interface Recurring {
    aggregateUsage: string | null;
    interval: string;
    intervalCount: number;
    meter: string | null;
    trialPeriodDays: number | null;
    usageType: string;
}

export interface PlanModel {
    id: string;
    object: string;
    active: boolean;
    billingScheme: string;
    created: string;
    currency: string;
    customUnitAmount: number | null;
    deleted: boolean | null;
    livemode: boolean;
    lookupKey: string | null;
    metadata: Record<string, any>;
    nickname: string | null;
    productId: string;
    product: string | null;
    recurring: Recurring | null;
    taxBehavior: string;
    tiers: any[] | null;
    tiersMode: string | null;
    transformQuantity: any | null;
    type: string;
    unitAmount: number;
    unitAmountDecimal: number;
}
