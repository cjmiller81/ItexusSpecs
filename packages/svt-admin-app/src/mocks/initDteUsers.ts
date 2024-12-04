import { Bot } from "@/features/strategies/dte/users/details/bot";
import { ICurrentDayFills } from "@/features/strategies/dte/users/details/currentDayFillsInterface";
import { OpenPosition } from "@/features/strategies/dte/users/details/openPosition";
import { IWorkingOrder } from "@/features/strategies/dte/users/details/workingOrderInterface";
import { IDteStrategiesResponse } from "@/features/strategies/dte/users/types";

export const initDteUsers: IDteStrategiesResponse = {
  "strategies": [
    {
      "accountNumber": "5WU50943",
      "active": true,
      "botStatus": "Flat",
      "connectionStatus": true,
      "entryOrderStatus": "",
      "hasEntryOrderStatus": false,
      "exchange": "Tastytrade",
      "exchangeUsername": "benec",
      "lastUpdatedAt": null,
      "masterSymbol": "SPX",
      "nextEntryTimestamp": {
        "seconds": 1733324340,
        "nanos": 0
      },
      "nextEndOfDayCloseTimestamp": null,
      "priceAverageFill": null,
      "removed": false,
      "stopOrderStatus": "",
      "hasStopOrderStatus": false,
      "targetOrderStatus": "",
      "hasTargetOrderStatus": false,
      "tradeQty": {
        "units": 1,
        "nanos": 0
      },
      "userId": "1e25b50d-5af4-4d5f-a2c8-31912e0e756d",
      "userMessage": "Strategy waiting to submit entry order.",
      "hasUserMessage": true
    },
    {
      "accountNumber": "5WU50958",
      "active": false,
      "botStatus": "",
      "connectionStatus": true,
      "entryOrderStatus": "",
      "hasEntryOrderStatus": false,
      "exchange": "Tastytrade",
      "exchangeUsername": "benec2",
      "lastUpdatedAt": null,
      "masterSymbol": "SPX",
      "nextEntryTimestamp": null,
      "nextEndOfDayCloseTimestamp": null,
      "priceAverageFill": null,
      "removed": true,
      "stopOrderStatus": "",
      "hasStopOrderStatus": false,
      "targetOrderStatus": "",
      "hasTargetOrderStatus": false,
      "tradeQty": null,
      "userId": "8e53b50d-5af4-4d5f-a2c8-31912e0e123d",
      "userMessage": "",
      "hasUserMessage": false
    }
  ]
}

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
    userId: "1e25b50d-5af4-4d5f-a2c8-31912e0e756d"
  }
];

export const initOpenPosition: OpenPosition[] = [
  {
    "id": "53423kfddf",
    "userId": "1e25b50d-5af4-4d5f-a2c8-31912e0e756d",
    "avgPrice": 24.5,
    "currencySymbol": "$",
    "instrument": "26 SEP 24 5725 Call",
    "qty": -1,
    "pAndL": 300
  },
  {
    "id": "tkrtr4434",
    "userId": "1e25b50d-5af4-4d5f-a2c8-31912e0e756d",
    "avgPrice": 5.1,
    "currencySymbol": "$",
    "instrument": "26 SEP 24 5725 Put",
    "qty": -1,
    "pAndL": 100
  },
  {
    "id": "tkrtr4435",
    "userId": "1e25b50d-5af4-4d5f-a2c8-31912e0e756d",
    "avgPrice": 11.2,
    "currencySymbol": "$",
    "instrument": "26 SEP 24 5750 Call",
    "qty": 1,
    "pAndL": -50
  },
  {
    "id": "tkrtr4436",
    "userId": "1e25b50d-5af4-4d5f-a2c8-31912e0e756d",
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
    userId: "8e53b50d-5af4-4d5f-a2c8-31912e0e123d",
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
    userId: "8e53b50d-5af4-4d5f-a2c8-31912e0e123d",
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
  