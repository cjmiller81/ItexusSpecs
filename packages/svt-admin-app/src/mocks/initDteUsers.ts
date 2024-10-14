import { Bot } from "@/features/strategies/dte/users/details/bot";
import { ICurrentDayFills } from "@/features/strategies/dte/users/details/currentDayFillsInterface";
import { OpenPosition } from "@/features/strategies/dte/users/details/openPosition";
import { IWorkingOrder } from "@/features/strategies/dte/users/details/workingOrderInterface";
import { IDteUser } from "@/features/strategies/dte/users/iDteUser";

export const initDteUsers: IDteUser[] = [
    {
      "id": "WP1234",
      "exchangeUsername": "tasty1234",
      "email": "tasty1234@gmail.com",
      "accountNumber": "FFE32324",
      "botStatus": "flat",
      "lastFill": 342343,
      "fillTime": new Date(),
      "openQty": 3,
      "connectionStatus": "Disconnected",
    },
    {
      "id": "WP5678",
      "exchangeUsername": "tasty5678",
      "email": "tasty5678@gmail.com",
      "accountNumber": "RRTT23234",
      "botStatus": "error",
      "lastFill": 43434.5454,
      "fillTime": new Date(),
      "openQty": 0,
      "connectionStatus": "Connected",
    }
]

export const initBots: Bot[] = [
{
    active: true,
    atrPeriod: 14,
    capitalAllocation: 150000,
    entryOrderId: "EO123456789",
    hasEntryOrderId: true,
    entryOrderStatus: "Filled",
    hasEntryOrderStatus: true,
    exchange: "NYSE",
    exchangeAccountNumber: "ACC0987654321",
    masterSymbolAssetType: "Equity",
    stopOrderId: "SO123456789",
    hasStopOrderId: true,
    hasStopOrderStatus: true,
    targetOrderId: "TO123456789",
    hasTargetOrderId: true,
    targetOrderStatus: "Working",
    hasTargetOrderStatus: true,
    qty: 1,
    tradeQty: {
      units: 10,
      nanos: 500000000
    },
    tradeSymbol: "SPX",
    tradeSymbolAssetType: "Equity",
    userId: "WP1234"
  }
];

export const initOpenPosition: OpenPosition[] = [
  {
    "id": "53423kfddf",
    "userId": "WP1234",
    "avgPrice": 24.5,
    "currencySymbol": "$",
    "instrument": "26 SEP 24 5725 Call",
    "qty": -1,
    "pAndL": 300
  },
  {
    "id": "tkrtr4434",
    "userId": "WP1234",
    "avgPrice": 5.1,
    "currencySymbol": "$",
    "instrument": "26 SEP 24 5725 Put",
    "qty": -1,
    "pAndL": 100
  },
  {
    "id": "tkrtr4435",
    "userId": "WP1234",
    "avgPrice": 11.2,
    "currencySymbol": "$",
    "instrument": "26 SEP 24 5750 Call",
    "qty": 1,
    "pAndL": -50
  },
  {
    "id": "tkrtr4436",
    "userId": "WP1234",
    "avgPrice": 1.95,
    "currencySymbol": "$",
    "instrument": "26 SEP 24 5700 Put",
    "qty": 1,
    "pAndL": -50
  }
]

export const initCurrentDayFills: ICurrentDayFills[] = [
  {
    id: "005a7378-e6e9-47345d-b6f4-88931365435435",
    userId: "WP5678",
    accountNumber: "ABC5678",
    tradeSymbol: "5750 | 5725 | 5700",
    exchangeOrderId: "55555654",
    instruction: "Sell to Open",
    isEntryOrder: true,
    isExitOrder: false,
    status: "Filled",
    exchangeEntryOrderId: "",
    entryId: "",
    orderId: "55555654",
    transactionTime: new Date("2024-09-20 9:00"),
  },
];

export const initWorkingOrders: IWorkingOrder[] = [
  {
    id: "005a7378-e459-47fd-b6f4-889313rtyty543",
    userId: "WP5678",
    accountNumber: "ABC5678",
    tradeSymbol: "5750 | 5725 | 5700",
    exchangeOrderId: "12345678",
    instruction: "Buy to Close",
    isEntryOrder: false,
    isExitOrder: true,
    status: "Working",
    exchangeEntryOrderId: "",
    entryId: "55555654",
    orderId: "77653731",
    transactionTime: new Date("2024-09-20 9:00:00"),
  },
];
  