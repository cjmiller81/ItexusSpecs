export interface CustomerTransactionData {
    TransactionID: string;
    Timestamp: Date;
    ClReqID: string;
    Revision: number;
    TransactionType: string;
    Quantity: string;
    Currency: string;
    CustomerAddressID?: string;
    RoutingInfo?: string;
    CustomerUser?: string;
    Counterparty: string;
    MarketAccount: string;
    Initiator: string;
    InitiatorUser?: string;
    DealerUser?: string;
    TreasuryUser?: string;
    TransferID?: string;
    TxHash?: string;
    Status: string;
    RejectReason?: string;
    RejectText?: string;
    Comments?: string;
    ExternalID?: string;
}


  export interface SettlementTableRow {
    type: string;
    settlementId?: string;
    time: Date;
    date: Date;
    amount: number;
    currency: string;
    status?: string;
    reference: string;
    destination: string
};