
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
    managedOrderList_: IManagedOrder[]
}

export interface IManagedOrder {
    accountNumber: string;
    duration: string;
    exchangeCode: string;
    orderId: string;
    hasOrderId: boolean;
    exchangeOrderId: string;
    exchangeReplacesOrderId: string;
    instruction: string;
    legs: {
        managedOrderList_: IManagedOrder[];
    };
    qtyPlaced: number;
    qtyFilled: number;
    marketAssetType: string;
    marketSymbol: string;
    orderStatus: string;
    orderType: string;
    priceAverageFill: number;
    priceLimit: number;
    priceStopLimit: number;
    priceStopTrigger: number;
    rejectReason: string;
    timeCreated: Date;
    timeLastUpdated: Date;
}