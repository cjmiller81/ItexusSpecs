
import { Status } from "components";

export interface IAdminUsersSliceState {
    adminUsers?: IAdminUserConnectionList;
    exchangeAccounts?: IExchangeAccountList;
    userDetails?: IAdminUserDetails;
    statusFetchingUserConnectionList: Status;
    statusFetchingExchangeAccounts: Status;
    statusFetchingUserDetails: Status;
}

export interface IAdminUserConnectionList {
    userAccountConnectionList_: IUserAccountConnection[];
}

export interface IUserAccountConnection {
    id: string;
    userSource: string;
    userId: string;
    exchange: string;
    exchangeUsername: string;
    stripeCustomerId: string;
    epdCustomerId: string;
    isCertUser: boolean;
    status: string;
}
  
export interface IAdminUserDetails {
    positionList: IPositionList;
    managedOrderList: IManagedOrderList;
}

export interface IExchangeAccountList {
    accounts: IExchangeAccount[]
}

export interface IExchangeAccount {
    exchangeUsername: string,
    accountBalance: IAccountNumber,
    accountName: string,
    accountNumber: string,
    authorityLevel: string,
    isClosed: boolean,
    isFuturesApproved: boolean,
    isMargin: boolean,
    isPrimary: boolean,
    suitableOptionsLevel: string
}

interface IAccountNumber {
    units: number,
    nanos: number
}

export interface IPositionList {
    positions: IPosition[]
}

export interface IPosition {
    username: string;
    accountNumber: string;
    amount: number;
    amountFilled: number;
    multiplier: number;
    averagePrice: number;
    fees: number;
    direction: string;
    instruction: string;
    liquidationPrice: number;
    leverage: number;
    lastPrice: number;
    marketAssetType: string;
    marketSymbol: string;
    underlyingSymbol: string;
    message: string;
    timestamp: ITimeStamp;
}

interface ITimeStamp {
    seconds: number,
    nanos: number
}

export interface IManagedOrderList {
    orders: IManagedOrder[]
}

export interface IManagedOrder {
    accountNumber: string;
    duration: string;
    exchangeCode: string;
    exchangeOrderId: string;
    exchangeReplacesOrderId: string;
    hasExchangeReplacesOrderId: boolean;
    instruction: string;
    marketAssetType: string;
    marketSymbol: string;
    orderId: string;
    orderStatus: string;
    orderType: string;
    priceAverageFill?: number | null;
    hasPriceAverageFill: boolean;
    priceLimit?: number | null;
    hasPriceLimit: boolean;
    priceStopLimit: number;
    hasPriceStopLimit: boolean;
    priceStopTrigger: number;
    hasPriceStopTrigger: boolean;
    qtyFilled?: number | null;
    qtyPlaced: number;
    rejectReason?: string | null;
    source: string;
    timeCreated: ITimeStamp;
    timeFirstFill?: ITimeStamp | null;
    timeLastUpdated: ITimeStamp;
    timeSubmitted?: ITimeStamp | null;
    triggerType: string;
    legs: ILeg[];
}

export interface ILeg {
    instruction: string;
    marketAssetType: string;
    marketSymbol: string;
    priceAverageFill?: number | null;
    hasPriceAverageFill: boolean;
    priceLimit?: number | null;
    hasPriceLimit: boolean;
    priceStopLimit: number;
    hasPriceStopLimit: boolean;
    priceStopTrigger: number;
    hasPriceStopTrigger: boolean;
    qtyFilled?: number | null;
    qtyPlaced: number;
}