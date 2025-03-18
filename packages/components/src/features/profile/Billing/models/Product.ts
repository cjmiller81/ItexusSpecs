export interface MarketingFeature {
    name: string;
    rawJObject: {
      name: any[];
    };
    stripeResponse: any | null;
  }
  
  export interface Metadata {
    page_access: string; 
  }
  
  export interface Product {
    id: string;
    object: string;
    active: boolean;
    created: string;
    defaultPriceId: string;
    defaultPrice: any | null;
    deleted: boolean | null;
    description: string;
    images: string[];
    livemode: boolean;
    marketingFeatures: MarketingFeature[];
    metadata: Metadata;
    name: string;
    packageDimensions: any | null;
    shippable: boolean | null;
    statementDescriptor: string | null;
    taxCodeId: string | null;
    taxCode: string | null;
    type: string;
    unitLabel: string | null;
    updated: string;
    url: string | null;
    rawJObject: any; 
    stripeResponse: any | null;
  }
  