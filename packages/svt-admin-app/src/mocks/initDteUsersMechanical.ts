import { Mechanical0DteSpxList } from "@/features/strategies/0dte-mechanical/users/types";

export const initDteMechanicalUsers: Mechanical0DteSpxList = {
    "strategies": [
      {
        "strategyId": "051c3973-cb7e-4779-b531-7ea7344199da",
        "accountNumber": "5WX88134",
        "active": false,
        "botStatus": "zdteInitial",
        "connectionStatus": false,
        "exchange": "Tastytrade",
        "lastUpdatedAt": null,
        "masterSymbol": "SPX",
        "removed": false,
        "userId": "WP2",
        "userMessage": "Next Entry Scan start time: 03/25/2025 13:32:00 UTC",
        "hasUserMessage": true,
        "strategySettings": {
          "spreadType": "ironCondor",
          "entryOrderAtOpenOffsetMinutes": 2,
          "targetCreditShortPut": {
            "units": 2,
            "nanos": 0
          },
          "strikeDistanceLongPut": {
            "units": 150,
            "nanos": 0
          },
          "targetCreditShortCall": {
            "units": 2,
            "nanos": 0
          },
          "strikeDistanceLongCall": {
            "units": 150,
            "nanos": 0
          },
          "stopLossPercentShortPut": {
            "units": 6,
            "nanos": 0
          },
          "stopLossPercentShortCall": {
            "units": 6,
            "nanos": 0
          },
          "useVixPrice": false,
          "hasUseVixPrice": true,
          "useVixGaps": true,
          "hasUseVixGaps": true,
          "minVixPrice": null,
          "maxVixPrice": null,
          "minVixOvernightGapUp": null,
          "maxVixOvernightGapUp": null,
          "minVixOvernightGapDown": null,
          "maxVixOvernightGapDown": {
            "units": 0,
            "nanos": 2500000
          }
        },
        "foundStrikes": {
          "expirationType": "Weekly",
          "expirationDate": {
            "seconds": 1742569200,
            "nanos": 0
          },
          "daysToExpiration": 0,
          "settlementType": "PM",
          "strikes": [
            {
              "strikes": [
                {
                  "strikePrice": {
                    "units": 200,
                    "nanos": 0
                  },
                  "call": "SPXW  250321C00200000",
                  "callStreamerSymbol": ".SPXW250321C200",
                  "put": "SPXW  250321P00200000",
                  "putStreamerSymbol": ".SPXW250321P200"
                }
              ]
            }
          ]
        },
        "callUpperLegPosition": {
          "accountNumber": "5WX88134",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250321C05855000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "373696056": "d8da9f09-1d50-481e-b98b-9ce0964e1ab3"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {
            "373696056": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 0,
                "nanos": 30000000
              }
            }
          },
          "filledShortOrders": {},
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742563923,
            "nanos": 417000000
          },
          "errorOrders": {}
        },
        "callLowerLegPosition": {
          "accountNumber": "5WX88134",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250321C05705000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "373696056": "d8da9f09-1d50-481e-b98b-9ce0964e1ab3",
            "373696133": "3c669a66-9698-44ae-b0ad-f39f3f1b6477"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {},
          "filledShortOrders": {
            "373696056": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 2,
                "nanos": 180000000
              }
            }
          },
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742587590,
            "nanos": 59000000
          },
          "errorOrders": {}
        },
        "putUpperLegPosition": {
          "accountNumber": "5WX88134",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250321P05525000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "373696056": "d8da9f09-1d50-481e-b98b-9ce0964e1ab3",
            "373696119": "851374e5-a342-4cba-80bb-e9d534c3bdc6"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {},
          "filledShortOrders": {
            "373696056": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 2,
                "nanos": 280000000
              }
            }
          },
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742587200,
            "nanos": 128000000
          },
          "errorOrders": {}
        },
        "putLowerLegPosition": {
          "accountNumber": "5WX88134",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250321P05375000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "373696056": "d8da9f09-1d50-481e-b98b-9ce0964e1ab3"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {
            "373696056": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 0,
                "nanos": 30000000
              }
            }
          },
          "filledShortOrders": {},
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742563923,
            "nanos": 417000000
          },
          "errorOrders": {}
        },
        "callUpperLegOriginalQty": 0,
        "hasCallUpperLegOriginalQty": true,
        "callLowerLegOriginalQty": 0,
        "hasCallLowerLegOriginalQty": true,
        "putUpperLegOriginalQty": 0,
        "hasPutUpperLegOriginalQty": true,
        "putLowerLegOriginalQty": 0,
        "hasPutLowerLegOriginalQty": true,
        "callLowerLegOriginalWorkingStopQty": 0,
        "hasCallLowerLegOriginalWorkingStopQty": true,
        "putUpperLegOriginalWorkingStopQty": 0,
        "hasPutUpperLegOriginalWorkingStopQty": true,
        "callUpperLegStrike": {
          "strikePrice": {
            "units": 5855,
            "nanos": 0
          },
          "call": "SPXW  250321C05855000",
          "callStreamerSymbol": ".SPXW250321C5855",
          "put": "SPXW  250321P05855000",
          "putStreamerSymbol": ".SPXW250321P5855"
        },
        "callLowerLegStrike": {
          "strikePrice": {
            "units": 5705,
            "nanos": 0
          },
          "call": "SPXW  250321C05705000",
          "callStreamerSymbol": ".SPXW250321C5705",
          "put": "SPXW  250321P05705000",
          "putStreamerSymbol": ".SPXW250321P5705"
        },
        "putUpperLegStrike": {
          "strikePrice": {
            "units": 5525,
            "nanos": 0
          },
          "call": "SPXW  250321C05525000",
          "callStreamerSymbol": ".SPXW250321C5525",
          "put": "SPXW  250321P05525000",
          "putStreamerSymbol": ".SPXW250321P5525"
        },
        "putLowerLegStrike": {
          "strikePrice": {
            "units": 5375,
            "nanos": 0
          },
          "call": "SPXW  250321C05375000",
          "callStreamerSymbol": ".SPXW250321C5375",
          "put": "SPXW  250321P05375000",
          "putStreamerSymbol": ".SPXW250321P5375"
        },
        "callUpperLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 0.05,
          "askSize": 1307,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 0,
          "bidSize": 0,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250321C5855",
          "hasSymbol": true
        },
        "callLowerLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 2.3,
          "askSize": 48,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 2.25,
          "bidSize": 66,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250321C5705",
          "hasSymbol": true
        },
        "putUpperLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 2.35,
          "askSize": 92,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 2.25,
          "bidSize": 163,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250321P5525",
          "hasSymbol": true
        },
        "putLowerLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 0.05,
          "askSize": 149,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 0,
          "bidSize": 0,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250321P5375",
          "hasSymbol": true
        },
        "vixPriceLevels": {
          "vixOpen": {
            "units": 19,
            "nanos": 50000000
          },
          "vixPreviousClose": {
            "units": 19,
            "nanos": 280000000
          },
          "currentVixPrice": {
            "units": 17,
            "nanos": 480000000
          },
          "openTimestamp": {
            "seconds": 1742823000,
            "nanos": 0
          },
          "previousCloseTimestamp": {
            "seconds": 1742588100,
            "nanos": 0
          },
          "currentTimestamp": {
            "seconds": 1742847300,
            "nanos": 0
          }
        },
        "state": 0
      },
      {
        "strategyId": "3d951a3a-c554-4dfc-a5f5-058dcee73f30",
        "accountNumber": "5WX88134",
        "active": false,
        "botStatus": "zdteInitial",
        "connectionStatus": false,
        "exchange": "Tastytrade",
        "lastUpdatedAt": null,
        "masterSymbol": "SPX",
        "removed": false,
        "userId": "WP2",
        "userMessage": "Next Entry Scan start time: 03/25/2025 13:44:00 UTC",
        "hasUserMessage": true,
        "strategySettings": {
          "spreadType": "ironCondor",
          "entryOrderAtOpenOffsetMinutes": 14,
          "targetCreditShortPut": {
            "units": 2,
            "nanos": 0
          },
          "strikeDistanceLongPut": {
            "units": 150,
            "nanos": 0
          },
          "targetCreditShortCall": {
            "units": 2,
            "nanos": 0
          },
          "strikeDistanceLongCall": {
            "units": 150,
            "nanos": 0
          },
          "stopLossPercentShortPut": {
            "units": 4,
            "nanos": 0
          },
          "stopLossPercentShortCall": {
            "units": 4,
            "nanos": 0
          },
          "useVixPrice": false,
          "hasUseVixPrice": true,
          "useVixGaps": true,
          "hasUseVixGaps": true,
          "minVixPrice": null,
          "maxVixPrice": null,
          "minVixOvernightGapUp": null,
          "maxVixOvernightGapUp": null,
          "minVixOvernightGapDown": null,
          "maxVixOvernightGapDown": {
            "units": 0,
            "nanos": 2500000
          }
        },
        "foundStrikes": {
          "expirationType": "Weekly",
          "expirationDate": {
            "seconds": 1742569200,
            "nanos": 0
          },
          "daysToExpiration": 0,
          "settlementType": "PM",
          "strikes": [
            {
              "strikes": [
                {
                  "strikePrice": {
                    "units": 200,
                    "nanos": 0
                  },
                  "call": "SPXW  250321C00200000",
                  "callStreamerSymbol": ".SPXW250321C200",
                  "put": "SPXW  250321P00200000",
                  "putStreamerSymbol": ".SPXW250321P200"
                }
              ]
            }
          ]
        },
        "callUpperLegPosition": {
          "accountNumber": "5WX88134",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250321C05865000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "373713019": "41fc28db-d7af-4231-9230-ed497cd85d5a"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {
            "373713019": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 0,
                "nanos": 30000000
              }
            }
          },
          "filledShortOrders": {},
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742564648,
            "nanos": 42000000
          },
          "errorOrders": {}
        },
        "callLowerLegPosition": {
          "accountNumber": "5WX88134",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250321C05715000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "373713019": "41fc28db-d7af-4231-9230-ed497cd85d5a",
            "373713143": "edb1a28c-9e39-46c6-ae75-6b8f737b1dba"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {},
          "filledShortOrders": {
            "373713019": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 1,
                "nanos": 850000000
              }
            }
          },
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742587203,
            "nanos": 769000000
          },
          "errorOrders": {}
        },
        "putUpperLegPosition": {
          "accountNumber": "5WX88134",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250321P05535000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "373713019": "41fc28db-d7af-4231-9230-ed497cd85d5a",
            "373713137": "6fd143dd-67ce-4096-a4c2-e3b0351c50e5"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {},
          "filledShortOrders": {
            "373713019": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 2,
                "nanos": 250000000
              }
            }
          },
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742587200,
            "nanos": 924000000
          },
          "errorOrders": {}
        },
        "putLowerLegPosition": {
          "accountNumber": "5WX88134",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250321P05385000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "373713019": "41fc28db-d7af-4231-9230-ed497cd85d5a"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {
            "373713019": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 0,
                "nanos": 70000000
              }
            }
          },
          "filledShortOrders": {},
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742564648,
            "nanos": 42000000
          },
          "errorOrders": {}
        },
        "callUpperLegOriginalQty": 0,
        "hasCallUpperLegOriginalQty": true,
        "callLowerLegOriginalQty": 0,
        "hasCallLowerLegOriginalQty": true,
        "putUpperLegOriginalQty": 0,
        "hasPutUpperLegOriginalQty": true,
        "putLowerLegOriginalQty": 0,
        "hasPutLowerLegOriginalQty": true,
        "callLowerLegOriginalWorkingStopQty": 0,
        "hasCallLowerLegOriginalWorkingStopQty": true,
        "putUpperLegOriginalWorkingStopQty": 0,
        "hasPutUpperLegOriginalWorkingStopQty": true,
        "callUpperLegStrike": {
          "strikePrice": {
            "units": 5865,
            "nanos": 0
          },
          "call": "SPXW  250321C05865000",
          "callStreamerSymbol": ".SPXW250321C5865",
          "put": "SPXW  250321P05865000",
          "putStreamerSymbol": ".SPXW250321P5865"
        },
        "callLowerLegStrike": {
          "strikePrice": {
            "units": 5715,
            "nanos": 0
          },
          "call": "SPXW  250321C05715000",
          "callStreamerSymbol": ".SPXW250321C5715",
          "put": "SPXW  250321P05715000",
          "putStreamerSymbol": ".SPXW250321P5715"
        },
        "putUpperLegStrike": {
          "strikePrice": {
            "units": 5535,
            "nanos": 0
          },
          "call": "SPXW  250321C05535000",
          "callStreamerSymbol": ".SPXW250321C5535",
          "put": "SPXW  250321P05535000",
          "putStreamerSymbol": ".SPXW250321P5535"
        },
        "putLowerLegStrike": {
          "strikePrice": {
            "units": 5385,
            "nanos": 0
          },
          "call": "SPXW  250321C05385000",
          "callStreamerSymbol": ".SPXW250321C5385",
          "put": "SPXW  250321P05385000",
          "putStreamerSymbol": ".SPXW250321P5385"
        },
        "callUpperLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 0.05,
          "askSize": 2024,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 0,
          "bidSize": 0,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250321C5865",
          "hasSymbol": true
        },
        "callLowerLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 2.05,
          "askSize": 254,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 1.95,
          "bidSize": 109,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250321C5715",
          "hasSymbol": true
        },
        "putUpperLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 2.25,
          "askSize": 278,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 2.15,
          "bidSize": 76,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250321P5535",
          "hasSymbol": true
        },
        "putLowerLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 0.1,
          "askSize": 471,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 0.05,
          "bidSize": 88,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250321P5385",
          "hasSymbol": true
        },
        "vixPriceLevels": {
          "vixOpen": {
            "units": 19,
            "nanos": 50000000
          },
          "vixPreviousClose": {
            "units": 19,
            "nanos": 280000000
          },
          "currentVixPrice": {
            "units": 17,
            "nanos": 480000000
          },
          "openTimestamp": {
            "seconds": 1742823000,
            "nanos": 0
          },
          "previousCloseTimestamp": {
            "seconds": 1742588100,
            "nanos": 0
          },
          "currentTimestamp": {
            "seconds": 1742847300,
            "nanos": 0
          }
        },
        "state": 0
      },
      {
        "strategyId": "155ac354-f2a0-4de5-8aad-26bc1fa57b8d",
        "accountNumber": "5WU60805",
        "active": true,
        "botStatus": "zdteStopLossOrderWorking",
        "connectionStatus": false,
        "exchange": "Tastytrade",
        "lastUpdatedAt": null,
        "masterSymbol": "SPX",
        "removed": false,
        "userId": "WP27",
        "userMessage": "Next Entry Scan start time: 03/26/2025 13:32:00 UTC",
        "hasUserMessage": true,
        "strategySettings": {
          "spreadType": "ironCondor",
          "entryOrderAtOpenOffsetMinutes": 2,
          "targetCreditShortPut": {
            "units": 2,
            "nanos": 0
          },
          "strikeDistanceLongPut": {
            "units": 150,
            "nanos": 0
          },
          "targetCreditShortCall": {
            "units": 2,
            "nanos": 0
          },
          "strikeDistanceLongCall": {
            "units": 150,
            "nanos": 0
          },
          "stopLossPercentShortPut": {
            "units": 1,
            "nanos": 0
          },
          "stopLossPercentShortCall": {
            "units": 1,
            "nanos": 0
          },
          "useVixPrice": false,
          "hasUseVixPrice": true,
          "useVixGaps": true,
          "hasUseVixGaps": true,
          "minVixPrice": null,
          "maxVixPrice": null,
          "minVixOvernightGapUp": null,
          "maxVixOvernightGapUp": null,
          "minVixOvernightGapDown": null,
          "maxVixOvernightGapDown": {
            "units": 0,
            "nanos": 2500000
          }
        },
        "foundStrikes": {
          "expirationType": "Weekly",
          "expirationDate": {
            "seconds": 1742983200,
            "nanos": 0
          },
          "daysToExpiration": 0,
          "settlementType": "PM",
          "strikes": [
            {
              "strikes": [
                {
                  "strikePrice": {
                    "units": 2400,
                    "nanos": 0
                  },
                  "call": "SPXW  250326C02400000",
                  "callStreamerSymbol": ".SPXW250326C2400",
                  "put": "SPXW  250326P02400000",
                  "putStreamerSymbol": ".SPXW250326P2400"
                }
              ]
            }
          ]
        },
        "callUpperLegPosition": {
          "accountNumber": "5WU60805",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250326C05960000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "374475111": "eeefe3ea-0f20-4040-9d5a-016bc7c8e240"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {
            "374475111": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 0,
                "nanos": 30000000
              }
            }
          },
          "filledShortOrders": {},
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742995923,
            "nanos": 490000000
          },
          "errorOrders": {}
        },
        "callLowerLegPosition": {
          "accountNumber": "5WU60805",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250326C05810000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "374475111": "eeefe3ea-0f20-4040-9d5a-016bc7c8e240",
            "374475143": "e6c813b9-585b-4df5-9768-cfa095c3bf70"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {
            "374475143": {
              "units": 1,
              "nanos": 0
            }
          },
          "workingTargetOrders": {},
          "filledLongOrders": {},
          "filledShortOrders": {
            "374475111": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 1,
                "nanos": 900000000
              }
            }
          },
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742995924,
            "nanos": 119000000
          },
          "errorOrders": {}
        },
        "putUpperLegPosition": {
          "accountNumber": "5WU60805",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250326P05730000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "374475111": "eeefe3ea-0f20-4040-9d5a-016bc7c8e240",
            "374475138": "09fdd929-a792-44e7-a6e7-76d0344cde39"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {
            "374498469": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 4,
                "nanos": 700000000
              }
            }
          },
          "filledShortOrders": {
            "374475111": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 2,
                "nanos": 310000000
              }
            }
          },
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742997490,
            "nanos": 281000000
          },
          "errorOrders": {
            "374475138": "Your account does not have sufficient buying power available for this order. Please deposit funds or reduce the order size to place this."
          }
        },
        "putLowerLegPosition": {
          "accountNumber": "5WU60805",
          "exchange": "Tastytrade",
          "symbol": "SPXW  250326P05580000",
          "streamerSymbol": "",
          "strikePrice": null,
          "underlyingSymbol": "SPX",
          "exchangeIdToOrderId": {
            "374475111": "eeefe3ea-0f20-4040-9d5a-016bc7c8e240"
          },
          "filledEntryOrders": {},
          "filledExitOrders": {},
          "workingEntryOrders": {},
          "workingStopOrders": {},
          "workingTargetOrders": {},
          "filledLongOrders": {
            "374475111": {
              "item1": {
                "units": 1,
                "nanos": 0
              },
              "item2": {
                "units": 0,
                "nanos": 30000000
              }
            }
          },
          "filledShortOrders": {},
          "entryDate": null,
          "contractExpirationDate": null,
          "updatedAt": {
            "seconds": 1742995923,
            "nanos": 490000000
          },
          "errorOrders": {}
        },
        "callUpperLegOriginalQty": 0,
        "hasCallUpperLegOriginalQty": true,
        "callLowerLegOriginalQty": 0,
        "hasCallLowerLegOriginalQty": true,
        "putUpperLegOriginalQty": 0,
        "hasPutUpperLegOriginalQty": true,
        "putLowerLegOriginalQty": 0,
        "hasPutLowerLegOriginalQty": true,
        "callLowerLegOriginalWorkingStopQty": 0,
        "hasCallLowerLegOriginalWorkingStopQty": true,
        "putUpperLegOriginalWorkingStopQty": 0,
        "hasPutUpperLegOriginalWorkingStopQty": true,
        "callUpperLegStrike": {
          "strikePrice": {
            "units": 5960,
            "nanos": 0
          },
          "call": "SPXW  250326C05960000",
          "callStreamerSymbol": ".SPXW250326C5960",
          "put": "SPXW  250326P05960000",
          "putStreamerSymbol": ".SPXW250326P5960"
        },
        "callLowerLegStrike": {
          "strikePrice": {
            "units": 5810,
            "nanos": 0
          },
          "call": "SPXW  250326C05810000",
          "callStreamerSymbol": ".SPXW250326C5810",
          "put": "SPXW  250326P05810000",
          "putStreamerSymbol": ".SPXW250326P5810"
        },
        "putUpperLegStrike": {
          "strikePrice": {
            "units": 5730,
            "nanos": 0
          },
          "call": "SPXW  250326C05730000",
          "callStreamerSymbol": ".SPXW250326C5730",
          "put": "SPXW  250326P05730000",
          "putStreamerSymbol": ".SPXW250326P5730"
        },
        "putLowerLegStrike": {
          "strikePrice": {
            "units": 5580,
            "nanos": 0
          },
          "call": "SPXW  250326C05580000",
          "callStreamerSymbol": ".SPXW250326C5580",
          "put": "SPXW  250326P05580000",
          "putStreamerSymbol": ".SPXW250326P5580"
        },
        "callUpperLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 0.05,
          "askSize": 1677,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 0,
          "bidSize": 0,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250326C5960",
          "hasSymbol": true
        },
        "callLowerLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 2.05,
          "askSize": 158,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 1.95,
          "bidSize": 123,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250326C5810",
          "hasSymbol": true
        },
        "putUpperLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 2.3,
          "askSize": 19,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 2.25,
          "bidSize": 91,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250326P5730",
          "hasSymbol": true
        },
        "putLowerLegQuote": {
          "askTime": 0,
          "askExchangeCode": "",
          "askPrice": 0.05,
          "askSize": 737,
          "bidTime": 0,
          "bidExchangeCode": "",
          "bidPrice": 0,
          "bidSize": 0,
          "sequence": 0,
          "time": 0,
          "timeNanoPart": 0,
          "timeNanos": 0,
          "strikePrice": {
            "units": 1,
            "nanos": 0
          },
          "symbol": ".SPXW250326P5580",
          "hasSymbol": true
        },
        "vixPriceLevels": {
          "vixOpen": {
            "units": 17,
            "nanos": 180000000
          },
          "vixPreviousClose": {
            "units": 17,
            "nanos": 150000000
          },
          "currentVixPrice": {
            "units": 0,
            "nanos": 0
          },
          "openTimestamp": {
            "seconds": 1742995800,
            "nanos": 0
          },
          "previousCloseTimestamp": {
            "seconds": 1742933700,
            "nanos": 0
          },
          "currentTimestamp": {
            "seconds": 2147483647,
            "nanos": 23000000
          }
        },
        "state": 10
      },
      {
        "strategyId": "026b24f5-53d4-43af-8896-2c658f48d4be",
        "accountNumber": "5WX88134",
        "active": false,
        "botStatus": "zdteInitial",
        "connectionStatus": false,
        "exchange": "",
        "lastUpdatedAt": null,
        "masterSymbol": "SPX",
        "removed": true,
        "userId": "WP2",
        "userMessage": "",
        "hasUserMessage": true,
        "strategySettings": null,
        "foundStrikes": null,
        "callUpperLegPosition": null,
        "callLowerLegPosition": null,
        "putUpperLegPosition": null,
        "putLowerLegPosition": null,
        "callUpperLegOriginalQty": 0,
        "hasCallUpperLegOriginalQty": true,
        "callLowerLegOriginalQty": 0,
        "hasCallLowerLegOriginalQty": true,
        "putUpperLegOriginalQty": 0,
        "hasPutUpperLegOriginalQty": true,
        "putLowerLegOriginalQty": 0,
        "hasPutLowerLegOriginalQty": true,
        "callLowerLegOriginalWorkingStopQty": 0,
        "hasCallLowerLegOriginalWorkingStopQty": true,
        "putUpperLegOriginalWorkingStopQty": 0,
        "hasPutUpperLegOriginalWorkingStopQty": true,
        "callUpperLegStrike": null,
        "callLowerLegStrike": null,
        "putUpperLegStrike": null,
        "putLowerLegStrike": null,
        "callUpperLegQuote": null,
        "callLowerLegQuote": null,
        "putUpperLegQuote": null,
        "putLowerLegQuote": null,
        "vixPriceLevels": null,
        "state": 0
      },
      {
        "strategyId": "39f94dc0-3991-4133-8b80-9d4f5ed79ba9",
        "accountNumber": "5WX88134",
        "active": false,
        "botStatus": "zdteInitial",
        "connectionStatus": false,
        "exchange": "",
        "lastUpdatedAt": null,
        "masterSymbol": "SPX",
        "removed": true,
        "userId": "WP2",
        "userMessage": "",
        "hasUserMessage": true,
        "strategySettings": null,
        "foundStrikes": null,
        "callUpperLegPosition": null,
        "callLowerLegPosition": null,
        "putUpperLegPosition": null,
        "putLowerLegPosition": null,
        "callUpperLegOriginalQty": 0,
        "hasCallUpperLegOriginalQty": true,
        "callLowerLegOriginalQty": 0,
        "hasCallLowerLegOriginalQty": true,
        "putUpperLegOriginalQty": 0,
        "hasPutUpperLegOriginalQty": true,
        "putLowerLegOriginalQty": 0,
        "hasPutLowerLegOriginalQty": true,
        "callLowerLegOriginalWorkingStopQty": 0,
        "hasCallLowerLegOriginalWorkingStopQty": true,
        "putUpperLegOriginalWorkingStopQty": 0,
        "hasPutUpperLegOriginalWorkingStopQty": true,
        "callUpperLegStrike": null,
        "callLowerLegStrike": null,
        "putUpperLegStrike": null,
        "putLowerLegStrike": null,
        "callUpperLegQuote": null,
        "callLowerLegQuote": null,
        "putUpperLegQuote": null,
        "putLowerLegQuote": null,
        "vixPriceLevels": null,
        "state": 0
      },
      {
        "strategyId": "06933359-4f3b-4bb4-bf8c-a39b3485c2ff",
        "accountNumber": "5WU60805",
        "active": false,
        "botStatus": "zdteInitial",
        "connectionStatus": false,
        "exchange": "",
        "lastUpdatedAt": null,
        "masterSymbol": "SPX",
        "removed": true,
        "userId": "WP27",
        "userMessage": "",
        "hasUserMessage": true,
        "strategySettings": null,
        "foundStrikes": null,
        "callUpperLegPosition": null,
        "callLowerLegPosition": null,
        "putUpperLegPosition": null,
        "putLowerLegPosition": null,
        "callUpperLegOriginalQty": 0,
        "hasCallUpperLegOriginalQty": true,
        "callLowerLegOriginalQty": 0,
        "hasCallLowerLegOriginalQty": true,
        "putUpperLegOriginalQty": 0,
        "hasPutUpperLegOriginalQty": true,
        "putLowerLegOriginalQty": 0,
        "hasPutLowerLegOriginalQty": true,
        "callLowerLegOriginalWorkingStopQty": 0,
        "hasCallLowerLegOriginalWorkingStopQty": true,
        "putUpperLegOriginalWorkingStopQty": 0,
        "hasPutUpperLegOriginalWorkingStopQty": true,
        "callUpperLegStrike": null,
        "callLowerLegStrike": null,
        "putUpperLegStrike": null,
        "putLowerLegStrike": null,
        "callUpperLegQuote": null,
        "callLowerLegQuote": null,
        "putUpperLegQuote": null,
        "putLowerLegQuote": null,
        "vixPriceLevels": null,
        "state": 0
      }
    ]
  }
  