type Metadata = {
    max: number,
    page: number,
    page_count: number,
    total_count: number
}

export type Coin = {
    id: string;
    name: string;
    rank: number;
    symbol: string;
    fullname: string;
};

export type Category = {
    id: number;
    name: string;
};

export type CalendarEvent = {
    id: number;
    title: Record<string, string>;
    coins: Coin[];
    date_event: string;
    can_occur_before: boolean;
    created_date: string;
    displayed_date: string;
    categories: Category[];
    proof: string;
    source: string;
};

export type CalendarResponse = {
    _metadata: Metadata,
    body: CalendarEvent[],
}
export type CategoriesResponse = {
    _metadata: Metadata,
    body: Category[],
}