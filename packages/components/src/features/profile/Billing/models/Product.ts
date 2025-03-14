export interface Product {
    id: string;
    object: string;
    active: boolean;
    description: string | null;
    images: string[];
    name: string;
    unit_label: string | null;
    metadata: Record<string, any>;
    shippable: boolean;
    statement_descriptor: string;
    created: number;
    updated: number;
}