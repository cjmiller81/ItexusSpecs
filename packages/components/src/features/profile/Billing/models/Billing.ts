interface InvoiceSettings {
    customFields: any[] | null;
    defaultPaymentMethodId: string | null;
    default_payment_method: any | null;
    footer: any | null;
    renderingOptions: any | null;
    rawJObject: {
        custom_fields: any[];
        default_payment_method: any[];
        footer: any[];
        rendering_options: any[];
    };
    stripeResponse: any | null;
}

interface Metadata {
    userId: string;
}

interface RawJObject {
    id: any[];
    object: any[];
    address: any[];
    balance: any[];
    created: any[];
    currency: any[];
    default_source: any[];
    delinquent: any[];
    description: any[];
    discount: any[];
    email: any[];
    invoice_prefix: any[];
    invoice_settings: any[][];
    livemode: any[];
    metadata: any[][];
    name: any[];
    next_invoice_sequence: any[];
    phone: any[];
    preferred_locales: any[];
    shipping: any[];
    tax_exempt: any[];
    test_clock: any[];
}

export interface Billing {
    id: string;
    object: string;
    address: string | null;
    balance: number;
    cashBalance: number | null;
    created: string;
    currency: string | null;
    defaultSourceId: string | null;
    defaultSource: any | null;
    deleted: boolean | null;
    delinquent: boolean;
    description: string | null;
    discount: any | null;
    email: string;
    invoiceCreditBalance: any | null;
    invoicePrefix: string;
    invoice_settings: InvoiceSettings;
    livemode: boolean;
    metadata: Metadata;
    name: string | null;
    nextInvoiceSequence: number;
    phone: string | null;
    preferredLocales: string[];
    shipping: any | null;
    sources: any | null;
    subscriptions: any | null;
    tax: any | null;
    taxExempt: string;
    taxIds: any | null;
    testClockId: any | null;
    testClock: any | null;
    rawJObject: RawJObject;
}
