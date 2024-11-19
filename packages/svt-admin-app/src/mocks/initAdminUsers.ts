import { IExchangeAccountList, IManagedOrderList, IPositionList } from "@/features/strategies/users/types";

export const initExchangeAccounts: IExchangeAccountList = {
    "exchangeAccountList_": [
      {
        "exchangeUsername": "benec",
        "accountBalance": {
          "units": 999986,
          "nanos": 560000000
        },
        "accountName": "Individual",
        "accountNumber": "5WU50943",
        "authorityLevel": "owner",
        "isClosed": false,
        "isFuturesApproved": true,
        "isMargin": true,
        "isPrimary": false,
        "suitableOptionsLevel": "No Restrictions"
      },
      {
        "exchangeUsername": "benec",
        "accountBalance": {
          "units": 1000000,
          "nanos": 0
        },
        "accountName": "Individual",
        "accountNumber": "5WX30651",
        "authorityLevel": "owner",
        "isClosed": false,
        "isFuturesApproved": true,
        "isMargin": true,
        "isPrimary": false,
        "suitableOptionsLevel": "No Restrictions"
      },
      {
        "exchangeUsername": "benec",
        "accountBalance": {
          "units": 1000000,
          "nanos": 0
        },
        "accountName": "Individual",
        "accountNumber": "5WZ34717",
        "authorityLevel": "owner",
        "isClosed": false,
        "isFuturesApproved": true,
        "isMargin": true,
        "isPrimary": false,
        "suitableOptionsLevel": "No Restrictions"
      }
    ]
  }

export const initManagedOrderList: IManagedOrderList = {
    "managedOrderList_": [
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "orderId": "abf83ddc-20c5-4108-b7aa-a57dd997863d",
      "hasOrderId": true,
      "exchangeOrderId": "147919",
      "exchangeReplacesOrderId": "",
      "instruction": "Undefined",
      "legs": {
        "managedOrderList_": []
      },
      "qtyPlaced": 2,
      "qtyFilled": 0,
      "marketAssetType": "Future",
      "marketSymbol": "/ESZ4",
      "orderStatus": "Working",
      "orderType": "Straddle",
      "priceAverageFill": 0,
      "priceLimit": 0.15,
      "priceStopLimit": 0,
      "priceStopTrigger": 0,
      "rejectReason": "",
      "timeCreated": new Date("2024-10-22T19:29:08.4508042Z"),
      "timeLastUpdated": new Date("2024-10-22T15:32:56.6310000")
    },
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "orderId": "94c45ad4-a3b7-45c4-b1f8-73ef6cc49997",
      "hasOrderId": true,
      "exchangeOrderId": "147918",
      "exchangeReplacesOrderId": "",
      "instruction": "Undefined",
      "legs": {
        "managedOrderList_": []
      },
      "qtyPlaced": 1,
      "qtyFilled": 1,
      "marketAssetType": "Future",
      "marketSymbol": "/ESZ4",
      "orderStatus": "Filled",
      "orderType": "Straddle",
      "priceAverageFill": 0.0002,
      "priceLimit": 0,
      "priceStopLimit": 0,
      "priceStopTrigger": 0,
      "rejectReason": "",
      "timeCreated": new Date("2024-10-22T19:29:08.4508464Z"),
      "timeLastUpdated": new Date("2024-10-22T15:32:49.3930000")
    },
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "orderId": "06c3f65e-d426-4b32-85e4-b3f31f6fee7b",
      "hasOrderId": true,
      "exchangeOrderId": "147917",
      "exchangeReplacesOrderId": "",
      "instruction": "Undefined",
      "legs": {
        "managedOrderList_": []
      },
      "qtyPlaced": 2,
      "qtyFilled": 1,
      "marketAssetType": "Future",
      "marketSymbol": "/ESZ4",
      "orderStatus": "FilledPartiallyAndCancelled",
      "orderType": "Straddle",
      "priceAverageFill": 0.0002,
      "priceLimit": 0.05,
      "priceStopLimit": 0,
      "priceStopTrigger": 0,
      "rejectReason": "",
      "timeCreated": new Date("2024-10-22T19:29:08.4508946Z"),
      "timeLastUpdated": new Date("2024-10-22T15:32:48.9710000")
    },
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "orderId": "39aa1ced-31d0-425a-85f7-cb5b7748f810",
      "hasOrderId": true,
      "exchangeOrderId": "147916",
      "exchangeReplacesOrderId": "",
      "instruction": "Undefined",
      "legs": {
        "managedOrderList_": []
      },
      "qtyPlaced": 2,
      "qtyFilled": 0,
      "marketAssetType": "Future",
      "marketSymbol": "/ESZ4",
      "orderStatus": "Canceled",
      "orderType": "Straddle",
      "priceAverageFill": 0,
      "priceLimit": 0.1,
      "priceStopLimit": 0,
      "priceStopTrigger": 0,
      "rejectReason": "",
      "timeCreated": new Date("2024-10-22T19:29:08.4510357Z"),
      "timeLastUpdated": new Date("2024-10-22T15:32:36.4850000")
    },
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "orderId": "047d0ea3-2465-4eba-a4fd-beebb63f2267",
      "hasOrderId": true,
      "exchangeOrderId": "147446",
      "exchangeReplacesOrderId": "",
      "instruction": "Undefined",
      "legs": {
        "managedOrderList_": []
      },
      "qtyPlaced": 1,
      "qtyFilled": 0,
      "marketAssetType": "Future",
      "marketSymbol": "/ESZ4",
      "orderStatus": "Error",
      "orderType": "Straddle",
      "priceAverageFill": 0,
      "priceLimit": 0.15,
      "priceStopLimit": 0,
      "priceStopTrigger": 0,
      "rejectReason": "Your account does not have sufficient buying power available for this order. Please deposit funds or reduce the order size to place this.",
      "timeCreated": new Date("2024-10-22T19:29:08.4510545Z"),
      "timeLastUpdated": new Date("2024-10-18T21:07:09.7010000")
    }
  ]
}

export const initPositionList: IPositionList = {
"positionList_": [
    {
      "username": "WP4061",
      "accountNumber": "5WU50943",
      "amount": 2,
      "amountFilled": 2,
      "multiplier": 50,
      "averagePrice": 0.0001,
      "fees": 0,
      "direction": "Short",
      "instruction": "Undefined",
      "liquidationPrice": 0,
      "leverage": 0,
      "lastPrice": 0,
      "marketAssetType": "FutureOption",
      "marketSymbol": "./ESZ4 EW1Z4 241206P4400",
      "underlyingSymbol": "/ESZ4",
      "message": "",
      "timestamp": new Date("2024-10-22T09:32:36.8900000-06:00")
    },
    {
      "username": "WP4061",
      "accountNumber": "5WU50943",
      "amount": 2,
      "amountFilled": 2,
      "multiplier": 50,
      "averagePrice": 0.0001,
      "fees": 0,
      "direction": "Short",
      "instruction": "Undefined",
      "liquidationPrice": 0,
      "leverage": 0,
      "lastPrice": 0,
      "marketAssetType": "FutureOption",
      "marketSymbol": "./ESZ4 EW1Z4 241206C6400",
      "underlyingSymbol": "/ESZ4",
      "message": "",
      "timestamp": new Date("2024-10-22T09:32:37.2230000-06:00")
    }
  ]
}