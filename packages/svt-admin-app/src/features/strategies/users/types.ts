
import { Status } from "components";

export interface IAdminUsersSliceState {
    exchangeAccounts?: IExchangeAccountList;
    userDetails?: IAdminUserDetails;
    statusFetchingExchangeAccounts: Status;
    statusFetchingUserDetails: Status;
}
  
export interface IAdminUserDetails {
    positionList: IPositionList;
    managedOrderList: IManagedOrderList;
  };


export interface IExchangeAccountList {
    exchangeAccountList_: IExchangeAccount[]
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
    positionList_: IPosition[]
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
    timestamp: Date;
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