import { IvlUser } from "@/features/strategies/ivl/users/IvlUser"
import { Billing } from "@/features/strategies/ivl/users/details/billing"
import { Bot } from "@/features/strategies/ivl/users/details/bot"
import { CapitalAllocation } from "@/features/strategies/ivl/users/details/capitalAllocation"
import { ICurrentDayFills } from "@/features/strategies/ivl/users/details/currentDayFillsInterface"
import { OpenPosition } from "@/features/strategies/ivl/users/details/openPosition"
import { Order } from "@/features/strategies/ivl/users/details/order"
import { IWorkingOrder } from "@/features/strategies/ivl/users/details/workingOrderInterface"

export const initIvlUsers: IvlUser[] = [
  {
    userId: "WP1234",
    exchangeUsername: "tasty1234",
    connectionStatus: "Connected",
    accountNumber: "ABC1234",
    botStatus: "Active",
    lastUpdatedAt: {
      seconds: 1734361140,
      nanos: 0
    },
    tradeQty: {
      units: 0,
      nanos: 0
    },
  },
  {
    userId: "WP5678",
    exchangeUsername: "tasty5678",
    connectionStatus: "Connected",
    accountNumber: "ABC5678",
    botStatus: "error",
    lastUpdatedAt: {
      seconds: 1734361140,
      nanos: 0
    },
    tradeQty: {
      units: 3,
      nanos: 0
    },
  },
]
export const initOrders: Order[] = [
  {
    id: "005a7378-e6e9-47fd-b6f4-8893136f5d14",
    userId: "WP5678",
    accountNumber: "ABC5678",
    exchangeOrderId: "1234567890",
    instruction: "Sell To Open",
    isEntryOrder: true,
    isExitOrder: false,
    status: "Filled",
    exchangeEntryOrderId: "",
    transactionTime: new Date("2024-04-24 21:00:01.422"),
  },
  {
    id: "004e10d2-4cd1-46d6-8791-710f63425f68",
    userId: "WP5678",
    accountNumber: "ABC5678",
    exchangeOrderId: "2345678901",
    instruction: "Buy To Close",
    isEntryOrder: false,
    isExitOrder: true,
    status: "Working",
    exchangeEntryOrderId: "1234567890",
    transactionTime: new Date("2024-04-24 22:04:41.232"),
  },
]

export const initBot: Bot = {
  isStarted: true,
  capitalAllocation: {
    units: 30000,
    nanos: 0
  },
  capitalAllocationStart: {
      units: 30000,
      nanos: 0
  },
  capitalAllocationNext: {
      units: 30000,
      nanos: 0
  },
  entryOrderId: "EO123456789",
  entryExchangeOrderId: "162027",
  entryOrderStatus: 2,
  exchangeUsername: "asdfliku923",
  accountNumber: "ACC0987654321",
  exitOrderId: "",
  exitExchangeOrderId: "",
  exitOrderStatus: -1,
  exitOrderSymbol: "",
  riskTolerance: 0,
  contractQty: {
    units: 2,
    nanos: 0
  },
  closingOnly: false,
  entryOrderSymbol: "/ES",
  userMessage: "System error attempting to submit new entry for the 4 time: Request validation failed  Stopping automation!"
};

export const initAllocations: CapitalAllocation[] = [
  {
    id: "0013ab97-83f4-4f39-b933-42ff7d0acbfd",
    userId: "WP5678",
    accountNumber: "ABC5678",
    originalCapitalAllocation: 10123.45,
    capitalAllocation: 12547.92,
    dailyPNL: 3.92,
    totalPNL: 274.42,
    exchangeOrderId: "1234567890",
    updateType: "DAILY",
    transactionTime: new Date("2024-05-01 12:00:01.029"),
  },
  {
    id: "0013ab97-83f4-4f39-b933-42ff7d0acbfd",
    userId: "WP5678",
    accountNumber: "ABC5678",
    originalCapitalAllocation: 12547.92,
    capitalAllocation: 13218.73,
    dailyPNL: 54.72,
    totalPNL: 374.42,
    exchangeOrderId: "1234567890",
    updateType: "DAILY",
    transactionTime: new Date("2024-05-02 12:00:01.029"),
  },
  {
    id: "0013ab97-83f4-4f39-b933-42ff7d0acbfd",
    userId: "WP1234",
    accountNumber: "ABC5678",
    originalCapitalAllocation: 10123.45,
    capitalAllocation: 12547.92,
    dailyPNL: 3.92,
    totalPNL: 274.42,
    exchangeOrderId: "1234567890",
    updateType: "DAILY",
    transactionTime: new Date("2024-05-01 12:00:01.029"),
  },
]

export const initBillings: Billing[] = [
  {
    id: "000dc502-541c-4b68-870a-316b1e731ce2",
    userId: "WP5678",
    paymentGateway: "Stripe",
    stripeCustomerId: "cus_1234",
    stripeChargeId: "pi_5678",
    periodStart: new Date("2024-03-01 00:00:00"),
    periodEnd: new Date("2024-03-31 00:00:00"),
    description: "IVL ES Strategy Management Fee for period 03/01/2024 to 03/31/2024.",
    amount: 23.45,
    status: "succeeded",
    transactionTime: new Date("2024-04-01 12:00:00.832"),
  },
  {
    id: "0013ab97-83f4-4f39-b933-42ff7d0acbfd",
    userId: "WP5678",
    paymentGateway: "Stripe",
    stripeCustomerId: "cus_1234",
    stripeChargeId: "pi_5678",
    periodStart: new Date("2024-04-01 00:00:00"),
    periodEnd: new Date("2024-04-30 00:00:00"),
    description: "IVL ES Strategy Management Fee for period 04/01/2024 to 04/30/2024.",
    amount: 27.52,
    status: "succeeded",
    transactionTime: new Date("2024-05-01 12:00:01.029"),
  },
  {
    id: "000dc502-541c-4b68-810a-316b1e731ce2",
    userId: "WP1234",
    paymentGateway: "Dwolla",
    stripeCustomerId: "cus_1234",
    stripeChargeId: "pi_5678",
    periodStart: new Date("2024-03-01 00:00:00"),
    periodEnd: new Date("2024-03-31 00:00:00"),
    description: "IVL ES Strategy Management Fee for period 03/01/2024 to 03/31/2024.",
    amount: 23.45,
    status: "succeeded",
    transactionTime: new Date("2024-04-01 12:00:00.832"),
  },
  {
    id: "0013ab97-83f4-4f39-b233-42ff7d0acbfd",
    userId: "WP1234",
    paymentGateway: "Dwolla",
    stripeCustomerId: "cus_1234",
    stripeChargeId: "pi_5278",
    periodStart: new Date("2024-04-01 00:00:00"),
    periodEnd: new Date("2024-04-30 00:00:00"),
    description: "IVL ES Strategy Management Fee for period 04/01/2024 to 04/30/2024.",
    amount: 27.52,
    status: "failed",
    transactionTime: new Date("2024-05-01 12:00:01.029"),
  },
]

export const initOpenPosition: OpenPosition[] = [
  {
    "id": "53423kfddf",
    "userId": "WP1234",
    "avgPrice": 4.75,
    "currencySymbol": "$",
    "instrument": "31 OCT 24 6090 Call",
    "qty": -1,
    "pAndL": 200
  },
  {
    "id": "tkrtr4434",
    "userId": "WP1234",
    "avgPrice": 2.25,
    "currencySymbol": "$",
    "instrument": "31 OCT 24 4375 Put",
    "qty": -1,
    "pAndL": -100
  }
]

export const initCurrentDayFills: ICurrentDayFills[] = [
  {
    id: "005a7378-e6e9-47345d-b6f4-88931365435435",
    userId: "WP5678",
    accountNumber: "ABC5678",
    tradeSymbol: "6090 C | 4375 P",
    exchangeOrderId: "55555654",
    instruction: "Sell to Open",
    isEntryOrder: true,
    isExitOrder: false,
    status: "Filled",
    exchangeEntryOrderId: "",
    entryId: "",
    orderId: "55555654",
    transactionTime: "2024-09-20 13:15",
  },
];

export const initWorkingOrders: IWorkingOrder[] = [
  {
    id: "005a7378-e459-47fd-b6f4-889313rtyty543",
    userId: "WP5678",
    accountNumber: "ABC5678",
    tradeSymbol: "6090 C | 4375 P",
    exchangeOrderId: "12345678",
    instruction: "Buy to Close",
    isEntryOrder: false,
    isExitOrder: true,
    status: "Working",
    exchangeEntryOrderId: "",
    entryId: "55555654",
    orderId: "77653731",
    transactionTime: new Date("2024-09-20 13:15:00"),
  },
];
