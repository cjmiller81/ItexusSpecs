import { IFifoUser } from "@/features/strategies/users/iFifoUser"
import { Order } from "@/features/strategies/users/details/order"
import { Bot } from "@/features/strategies/users/details/bot"
import { OpenPosition } from "@/features/strategies/users/details/openPosition"

export const initFifoUsers: IFifoUser[] = [
  {
    "id": "WP1234",
    "exchangeUsername": "tasty1234",
    "email": "tasty1234@gmail.com",
    "accountNumber": "FFE32324",
    "botStatus": "flat",
    "lastFill": 342343,
    "fillTime": new Date("2024-05-01 12:00:01.029"),
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
    "fillTime": new Date("2024-05-01 14:00:01.029"),
    "openQty": 1,
    "connectionStatus": "Connected",
  },
  {
    "id": "WP91011",
    "exchangeUsername": "tasty91011",
    "email": "tasty91011@gmail.com",
    "accountNumber": "RRTT23234",
    "botStatus": "error",
    "lastFill": 43434.5454,
    "fillTime": new Date("2024-05-01 17:00:01.029"),
    "openQty": 1,
    "connectionStatus": "Connected",
  },
  {
    "id": "WP121314",
    "exchangeUsername": "tasty121314",
    "email": "tasty121314@gmail.com",
    "accountNumber": "RRTT23234",
    "botStatus": "flat",
    "lastFill": 4343,
    "fillTime": new Date("2024-05-01 19:00:01.029"),
    "openQty": 1,
    "connectionStatus": "Connected",
  }
]

export const initBots: Bot[] = [
  {
    active: true,
    atrPeriod: 14,
    capitalAllocation: 10000,
    entryOrderId: "EO123456789",
    hasEntryOrderId: true,
    entryOrderStatus: "Filled",
    hasEntryOrderStatus: true,
    exchange: "NYSE",
    exchangeAccountNumber: "ACC0987654321",
    masterSymbol: "/ES",
    masterSymbolAssetType: "Equity",
    stopOrderId: "SO123456789",
    hasStopOrderId: true,
    stopOrderStatus: "Active",
    hasStopOrderStatus: true,
    targetOrderId: "TO123456789",
    hasTargetOrderId: true,
    targetOrderStatus: "Pending",
    hasTargetOrderStatus: true,
    qty: 1,
    tradeQty: {
      units: 10,
      nanos: 500000000
    },
    tradeSymbol: "/ES",
    tradeSymbolAssetType: "Equity",
    userId: "U12365"
  },
  {
    active: false,
    atrPeriod: 15,
    capitalAllocation: 100,
    entryOrderId: "E34543456789",
    hasEntryOrderId: true,
    entryOrderStatus: "Filled",
    hasEntryOrderStatus: true,
    exchange: "NYSE",
    exchangeAccountNumber: "AFGGH0987654321",
    masterSymbol: "/ES",
    masterSymbolAssetType: "Equity",
    stopOrderId: "SO123456789",
    hasStopOrderId: true,
    stopOrderStatus: "Active",
    hasStopOrderStatus: true,
    targetOrderId: "TO345456789",
    hasTargetOrderId: true,
    targetOrderStatus: "Pending",
    hasTargetOrderStatus: true,
    qty: 100,
    tradeQty: {
      units: 10,
      nanos: 500000000
    },
    tradeSymbol: "SPY",
    tradeSymbolAssetType: "Equity",
    userId: "U79537"
  }
]

export const initOrders: Order[] = [
  {
    "id": "005a7378-e6e9-47fd-b6f4-8893136f5d14",
    "userId": "WP5678",
    "accountNumber": "ABC5678",
    "tradeSymbol": "/ES",
    "exchangeOrderId": "1234567890",
    "instruction": "Sell To Open",
    "isEntryOrder": true,
    "isExitOrder": false,
    "status": "Filled",
    "exchangeEntryOrderId": "",
    "transactionTime": "2024-04-24 21:00:01.422"
  },
  {
    "id": "004e10d2-4cd1-46d6-8791-710f63425f68",
    "userId": "WP5678",
    "accountNumber": "ABC5678",
    "tradeSymbol": "SPY",
    "exchangeOrderId": "2345678901",
    "instruction": "Buy To Close",
    "isEntryOrder": false,
    "isExitOrder": true,
    "status": "Working",
    "exchangeEntryOrderId": "1234567890",
    "transactionTime": "2024-04-24 22:04:41.232"
  }
]

export const initOpenPosition: OpenPosition[] = [
  {
    "id": "53423kfddf",
    "userId": "WP1234",
    "avgPrice": 5725.75,
    "currencySymbol": "$",
    "instrument": "/ES",
    "qty": 1,
    "pAndL": 12.50
  },
  {
    "id": "tkrtr4434",
    "userId": "WP5678",
    "avgPrice": 5725.75,
    "currencySymbol": "$",
    "instrument": "/ES",
    "qty": 1,
    "pAndL": -12.50
  },
  {
    "id": "tkrtr4435",
    "userId": "WP5678",
    "avgPrice": 5725.75,
    "currencySymbol": "$",
    "instrument": "/ES",
    "qty": 1,
    "pAndL": 2
  },
  {
    "id": "tkrtr4436",
    "userId": "WP121314",
    "avgPrice": 57.25,
    "currencySymbol": "$",
    "instrument": "/ES",
    "qty": 1,
    "pAndL": 0
  }
]