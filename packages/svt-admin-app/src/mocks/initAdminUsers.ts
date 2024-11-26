import { IAdminUserConnectionList, IExchangeAccountList, IManagedOrderList, IPositionList } from "@/features/strategies/users/types";

export const initAdminUsers: IAdminUserConnectionList = {
  "userAccountConnectionList_": [
    {
      "id": "98a8d87b-7fb9-4ae1-98f7-35af5d7ac0dd",
      "userSource": "WordPress",
      "userId": "WP4061",
      "exchange": "Tastytrade",
      "exchangeUsername": "benec",
      "stripeCustomerId": "",
      "epdCustomerId": "",
      "isCertUser": true,
      "status": "connected"
    }
  ]
}

export const initExchangeAccounts: IExchangeAccountList = {
  "accounts": [
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
  "orders": [
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "exchangeOrderId": "152876",
      "exchangeReplacesOrderId": "",
      "hasExchangeReplacesOrderId": false,
      "instruction": "Undefined",
      "marketAssetType": "Equity",
      "marketSymbol": "SPX",
      "orderId": "3c4400ee-c6d6-4bf9-888c-2175a201c8b0",
      "orderStatus": "Filled",
      "orderType": "Condor",
      "priceAverageFill": 2.52,
      "hasPriceAverageFill": true,
      "priceLimit": 2.5,
      "hasPriceLimit": true,
      "priceStopLimit": 0,
      "hasPriceStopLimit": false,
      "priceStopTrigger": 0,
      "hasPriceStopTrigger": false,
      "qtyFilled": 1,
      "qtyPlaced": 1,
      "rejectReason": "",
      "source": "TradingPlatform.Tastytrade_3c4400ee-c6d6-4bf9-888c-2175a201c8b0",
      "timeCreated": {
        "seconds": 1730486700,
        "nanos": 933000000
      },
      "timeFirstFill": {
        "seconds": 1730486701,
        "nanos": 145000000
      },
      "timeLastUpdated": {
        "seconds": 1730508301,
        "nanos": 253000000
      },
      "timeSubmitted": null,
      "triggerType": "None",
      "legs": [
        {
          "instruction": "BuyToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115C05735000",
          "priceAverageFill": 0.01,
          "hasPriceAverageFill": true,
          "priceLimit": 0.01,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 1,
          "qtyPlaced": 1
        },
        {
          "instruction": "SellToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115C05755000",
          "priceAverageFill": 0.01,
          "hasPriceAverageFill": true,
          "priceLimit": 0.01,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 1,
          "qtyPlaced": 1
        },
        {
          "instruction": "BuyToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115P05735000",
          "priceAverageFill": 2.53,
          "hasPriceAverageFill": true,
          "priceLimit": 2.53,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 1,
          "qtyPlaced": 1
        },
        {
          "instruction": "SellToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115P05715000",
          "priceAverageFill": 0.01,
          "hasPriceAverageFill": true,
          "priceLimit": 0.01,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 1,
          "qtyPlaced": 1
        }
      ]
    },
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "exchangeOrderId": "152875",
      "exchangeReplacesOrderId": "",
      "hasExchangeReplacesOrderId": false,
      "instruction": "Undefined",
      "marketAssetType": "Equity",
      "marketSymbol": "SPX",
      "orderId": "87b663c5-668d-4a99-98c7-4188f5d5c79f",
      "orderStatus": "Canceled",
      "orderType": "Condor",
      "priceAverageFill": 0,
      "hasPriceAverageFill": false,
      "priceLimit": 19.1,
      "hasPriceLimit": true,
      "priceStopLimit": 0,
      "hasPriceStopLimit": false,
      "priceStopTrigger": 0,
      "hasPriceStopTrigger": false,
      "qtyFilled": 0,
      "qtyPlaced": 1,
      "rejectReason": "",
      "source": "TradingPlatform.Tastytrade_87b663c5-668d-4a99-98c7-4188f5d5c79f",
      "timeCreated": {
        "seconds": 1730486694,
        "nanos": 888000000
      },
      "timeFirstFill": null,
      "timeLastUpdated": {
        "seconds": 1730508301,
        "nanos": 38000000
      },
      "timeSubmitted": null,
      "triggerType": "None",
      "legs": [
        {
          "instruction": "BuyToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115C05735000",
          "priceAverageFill": 0,
          "hasPriceAverageFill": false,
          "priceLimit": 0,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 0,
          "qtyPlaced": 1
        },
        {
          "instruction": "SellToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115C05755000",
          "priceAverageFill": 0,
          "hasPriceAverageFill": false,
          "priceLimit": 0,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 0,
          "qtyPlaced": 1
        },
        {
          "instruction": "BuyToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115P05735000",
          "priceAverageFill": 0,
          "hasPriceAverageFill": false,
          "priceLimit": 0,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 0,
          "qtyPlaced": 1
        },
        {
          "instruction": "SellToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115P05715000",
          "priceAverageFill": 0,
          "hasPriceAverageFill": false,
          "priceLimit": 0,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 0,
          "qtyPlaced": 1
        }
      ]
    },
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "exchangeOrderId": "152874",
      "exchangeReplacesOrderId": "",
      "hasExchangeReplacesOrderId": false,
      "instruction": "Undefined",
      "marketAssetType": "Equity",
      "marketSymbol": "SPX",
      "orderId": "683e50e7-19db-4192-a40c-acea3f9a5f50",
      "orderStatus": "Canceled",
      "orderType": "Condor",
      "priceAverageFill": 0,
      "hasPriceAverageFill": false,
      "priceLimit": 3.1,
      "hasPriceLimit": true,
      "priceStopLimit": 0,
      "hasPriceStopLimit": false,
      "priceStopTrigger": 0,
      "hasPriceStopTrigger": false,
      "qtyFilled": 0,
      "qtyPlaced": 1,
      "rejectReason": "",
      "source": "TradingPlatform.Tastytrade_683e50e7-19db-4192-a40c-acea3f9a5f50",
      "timeCreated": {
        "seconds": 1730486578,
        "nanos": 87000000
      },
      "timeFirstFill": null,
      "timeLastUpdated": {
        "seconds": 1730508294,
        "nanos": 937000000
      },
      "timeSubmitted": null,
      "triggerType": "None",
      "legs": [
        {
          "instruction": "BuyToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115C05735000",
          "priceAverageFill": 0,
          "hasPriceAverageFill": false,
          "priceLimit": 0,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 0,
          "qtyPlaced": 1
        },
        {
          "instruction": "SellToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115C05755000",
          "priceAverageFill": 0,
          "hasPriceAverageFill": false,
          "priceLimit": 0,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 0,
          "qtyPlaced": 1
        },
        {
          "instruction": "BuyToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115P05735000",
          "priceAverageFill": 0,
          "hasPriceAverageFill": false,
          "priceLimit": 0,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 0,
          "qtyPlaced": 1
        },
        {
          "instruction": "SellToClose",
          "marketAssetType": "Option",
          "marketSymbol": "SPX   241115P05715000",
          "priceAverageFill": 0,
          "hasPriceAverageFill": false,
          "priceLimit": 0,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 0,
          "qtyPlaced": 1
        }
      ]
    },
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "exchangeOrderId": "150463",
      "exchangeReplacesOrderId": "",
      "hasExchangeReplacesOrderId": false,
      "instruction": "Undefined",
      "marketAssetType": "Future",
      "marketSymbol": "/ESZ4",
      "orderId": "3ec9d3f7-58da-42ba-8918-728e8e001e97",
      "orderStatus": "Canceled",
      "orderType": "Straddle",
      "priceAverageFill": 0,
      "hasPriceAverageFill": false,
      "priceLimit": 0.15,
      "hasPriceLimit": true,
      "priceStopLimit": 0,
      "hasPriceStopLimit": false,
      "priceStopTrigger": 0,
      "hasPriceStopTrigger": false,
      "qtyFilled": 0,
      "qtyPlaced": 2,
      "rejectReason": "",
      "source": "TradingPlatform.Tastytrade_3ec9d3f7-58da-42ba-8918-728e8e001e97",
      "timeCreated": {
        "seconds": 1729810618,
        "nanos": 483000000
      },
      "timeFirstFill": null,
      "timeLastUpdated": {
        "seconds": 1729832259,
        "nanos": 412000000
      },
      "timeSubmitted": null,
      "triggerType": "None",
      "legs": [
        {
          "instruction": "BuyToClose",
          "marketAssetType": "FutureOption",
          "marketSymbol": "./ESZ4 EW1Z4 241206C6350",
          "priceAverageFill": 0,
          "hasPriceAverageFill": false,
          "priceLimit": 0,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 0,
          "qtyPlaced": 2
        },
        {
          "instruction": "BuyToClose",
          "marketAssetType": "FutureOption",
          "marketSymbol": "./ESZ4 EW1Z4 241206P4400",
          "priceAverageFill": 0,
          "hasPriceAverageFill": false,
          "priceLimit": 0,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 0,
          "qtyPlaced": 2
        }
      ]
    },
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "exchangeOrderId": "150462",
      "exchangeReplacesOrderId": "",
      "hasExchangeReplacesOrderId": false,
      "instruction": "Undefined",
      "marketAssetType": "Future",
      "marketSymbol": "/ESZ4",
      "orderId": "533c042b-174b-4089-b751-73e6d1c27506",
      "orderStatus": "Filled",
      "orderType": "Straddle",
      "priceAverageFill": 0.0002,
      "hasPriceAverageFill": true,
      "priceLimit": 0,
      "hasPriceLimit": true,
      "priceStopLimit": 0,
      "hasPriceStopLimit": false,
      "priceStopTrigger": 0,
      "hasPriceStopTrigger": false,
      "qtyFilled": 1,
      "qtyPlaced": 1,
      "rejectReason": "",
      "source": "TradingPlatform.Tastytrade_533c042b-174b-4089-b751-73e6d1c27506",
      "timeCreated": {
        "seconds": 1729810610,
        "nanos": 159000000
      },
      "timeFirstFill": {
        "seconds": 1729810610,
        "nanos": 734000000
      },
      "timeLastUpdated": {
        "seconds": 1729832211,
        "nanos": 282000000
      },
      "timeSubmitted": null,
      "triggerType": "None",
      "legs": [
        {
          "instruction": "SellToOpen",
          "marketAssetType": "FutureOption",
          "marketSymbol": "./ESZ4 EW1Z4 241206C6350",
          "priceAverageFill": 0.0001,
          "hasPriceAverageFill": true,
          "priceLimit": 0.0001,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 1,
          "qtyPlaced": 1
        },
        {
          "instruction": "SellToOpen",
          "marketAssetType": "FutureOption",
          "marketSymbol": "./ESZ4 EW1Z4 241206P4400",
          "priceAverageFill": 0.0001,
          "hasPriceAverageFill": true,
          "priceLimit": 0.0001,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 1,
          "qtyPlaced": 1
        }
      ]
    },
    {
      "accountNumber": "5WU50943",
      "duration": "Normal",
      "exchangeCode": "Tastytrade",
      "exchangeOrderId": "150461",
      "exchangeReplacesOrderId": "",
      "hasExchangeReplacesOrderId": false,
      "instruction": "Undefined",
      "marketAssetType": "Future",
      "marketSymbol": "/ESZ4",
      "orderId": "d54ed6ff-c510-4014-9625-91f35e1ac2db",
      "orderStatus": "FilledPartiallyAndCancelled",
      "orderType": "Straddle",
      "priceAverageFill": 0.0002,
      "hasPriceAverageFill": true,
      "priceLimit": 0.05,
      "hasPriceLimit": true,
      "priceStopLimit": 0,
      "hasPriceStopLimit": false,
      "priceStopTrigger": 0,
      "hasPriceStopTrigger": false,
      "qtyFilled": 1,
      "qtyPlaced": 2,
      "rejectReason": "",
      "source": "TradingPlatform.Tastytrade_d54ed6ff-c510-4014-9625-91f35e1ac2db",
      "timeCreated": {
        "seconds": 1729810597,
        "nanos": 466000000
      },
      "timeFirstFill": {
        "seconds": 1729810599,
        "nanos": 244000000
      },
      "timeLastUpdated": {
        "seconds": 1729832210,
        "nanos": 422000000
      },
      "timeSubmitted": null,
      "triggerType": "None",
      "legs": [
        {
          "instruction": "SellToOpen",
          "marketAssetType": "FutureOption",
          "marketSymbol": "./ESZ4 EW1Z4 241206C6350",
          "priceAverageFill": 0.0001,
          "hasPriceAverageFill": true,
          "priceLimit": 0.0001,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 1,
          "qtyPlaced": 1
        },
        {
          "instruction": "SellToOpen",
          "marketAssetType": "FutureOption",
          "marketSymbol": "./ESZ4 EW1Z4 241206P4400",
          "priceAverageFill": 0.0001,
          "hasPriceAverageFill": true,
          "priceLimit": 0.0001,
          "hasPriceLimit": true,
          "priceStopLimit": 0,
          "hasPriceStopLimit": false,
          "priceStopTrigger": 0,
          "hasPriceStopTrigger": false,
          "qtyFilled": 1,
          "qtyPlaced": 1
        }
      ]
    }
  ]
};

export const initPositionList: IPositionList = {
"positions": [
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
      "timestamp": {
        "seconds": 1730508301,
        "nanos": 253000000
      }
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
      "timestamp": {
        "seconds": 1730508301,
        "nanos": 253000000
      }
    }
  ]
}