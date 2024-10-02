import { Bot } from "@/features/strategies/dte/users/details/bot";
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
  