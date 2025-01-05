import { http, HttpResponse } from 'msw'
import { RequestHandler } from 'msw'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'
import {
  CreateFifo2StrategyRequest,
  CreateZeroDteStrategyRequest,
  Fifo2StrategyListItem,
  Fifo2StrategyListResponse,
  IvlRiskTolerance,
  SvtIvlEsStrategySetStatus,
  SvtIvlStrategyAccountConnect
} from '../services/tradingPlatformService'


const mockState :{
  connected: boolean,
  strategies: Fifo2StrategyListItem[]
  zeroDte: any[]
  status: any
} = {
  connected: false,
  strategies: [],
  zeroDte: [],
/*
  connected: true,
  strategies: [
    {
      active: true,
      atrPeriod: 14,
      capitalAllocation: 0,
      entryOrderId: "",
      hasEntryOrderId: false,
      entryOrderStatus: "",
      hasEntryOrderStatus: false,
      exchange: "Tastytrade",
      exchangeAccountNumber: "5WU50943",
      masterSymbol: "AAPL",
      masterSymbolAssetType: "Future",
      stopOrderId: "",
      hasStopOrderId: false,
      stopOrderStatus: "",
      hasStopOrderStatus: false,
      targetOrderId: "",
      hasTargetOrderId: false,
      targetOrderStatus: "",
      hasTargetOrderStatus: false,
      tradeQty: {
        units: 1,
        nanos: 0
      },
      tradeSymbol: "AAPL",
      tradeSymbolAssetType: "Future",
      userId: ""
    }
  ],
  status: {
    exchangeUsername: "benec",
    accountNumber: "5WU50943",
    riskTolerance: IvlRiskTolerance.High,
    isStarted: true,
    entryOrderId: "93b03dee-6734-4d3f-81fc-d3c6097d8f9c",
    entryOrderStatus: 4,
    entryOrderSymbol: "./ESH5 EW2G5 250214C6425 | ./ESH5 EW2G5 250214P4800",
    exitOrderId: "",
    exitOrderStatus: -1,
    exitOrderSymbol: "",
    closingOnly: false,
    capitalAllocation: {
      units: 12500,
      nanos: 0
    },
    capitalAllocationStart: {
      units: 12500,
      nanos: 0
    },
    capitalAllocationNext: {
      units: 12500,
      nanos: 0
    },
    contractQty: {
      units: 1,
      nanos: 0
    },
    userMessage: "Market Closed! Strategy will submit exit order at the open..."
  } as SvtIvlEsStrategySetStatus
*/
  status: {
    exchangeUsername: "benec",
    accountNumber: "5WU50943",
    riskTolerance: IvlRiskTolerance.High,
    isStarted: false,
    entryOrderId: null,
    entryOrderStatus: null,
    entryOrderSymbol: null,
    exitOrderId: null,
    exitOrderStatus: null,
    exitOrderSymbol: null,
    closingOnly: false,
    capitalAllocation: {
      units: 0,
      nanos: 0
    },
    capitalAllocationStart: {
      units: 15000,
      nanos: 0
    },
    capitalAllocationNext: {
      units: 15000,
      nanos: 0
    },
    contractQty: {
      units: 1,
      nanos: 0
    },
  } as SvtIvlEsStrategySetStatus
}

// Mock the `services/tradingPlatformService.ts` API requests.
export const tradingPlatformServiceHandlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = [
  /* TODO: This is currently disabled on the API server...
  http.get(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/positions`, () => {
    return HttpResponse.text('Hello world!')
  }),
  */

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/account/tastytrade/connect`, () => {
    mockState.connected = true

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/account/tastytrade/connect`, () => {
    mockState.connected = true

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.get(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/accounts`, () => {
    console.log("mockState: ", mockState)
    if (mockState.connected) {
      return HttpResponse.json([
        {
          "exchangeUsername": "benec",
          "accountBalance": "1020277.624",
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
          "accountBalance": "-1.702",
          "accountName": "Individual",
          "accountNumber": "5WX30651",
          "authorityLevel": "owner",
          "isClosed": false,
          "isFuturesApproved": false,
          "isMargin": true,
          "isPrimary": false,
          "suitableOptionsLevel": "No Restrictions"
        },
        {
          "exchangeUsername": "benec",
          "accountBalance": "0.0",
          "accountName": "Individual",
          "accountNumber": "5WZ34717",
          "authorityLevel": "owner",
          "isClosed": false,
          "isFuturesApproved": false,
          "isMargin": true,
          "isPrimary": false,
          "suitableOptionsLevel": "No Restrictions"
        }
      ])
    }

    return new HttpResponse(null, {
      status: 404
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/ivl/es`, async ({ request }) => {
    if (request.body) {
      const data = await request.json() as SvtIvlStrategyAccountConnect;

      console.log("IVL POST data: ", data)

      if (data) {
        if (data.closingOnly !== mockState.status.closingOnly && !mockState.status.isStarted) {
          mockState.status.closingOnly = data.closingOnly
        } else {
          mockState.status.isStarted = true
          mockState.status.closingOnly = data.closingOnly
          mockState.status.capitalAllocation = (data.capitalAllocation?.units ?? 0) === 0 ? data.capitalAllocationNext : data.capitalAllocation
          mockState.status.capitalAllocationNext = data.capitalAllocationNext
          mockState.status.entryOrderId = "131083"
          mockState.status.entryOrderStatus = "Filled"
          mockState.status.entryOrderSymbol = "AAPL"
          mockState.status.exitOrderId = "131084"
          mockState.status.exitOrderStatus = "Working"
          mockState.status.exitOrderSymbol = "AAPL"
        }
      }
    }

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.get(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/ivl/es`, () => {
    if (mockState.connected) {
      return HttpResponse.json(mockState.status)
    }

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/ivl/es/stop`, () => {
    console.log("IVL POST stop called")
    mockState.status.isStarted = false

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.get(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifo2Strategy/tastytrade`, () => {
    const response: Fifo2StrategyListResponse = {
      fifoStrategyList: mockState.strategies
    }
    return HttpResponse.json(response)
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifo2Strategy/tastytrade/:accountNumber/:masterSymbol/:tradeSymbol/start`, ({ params }) => {
    const {accountNumber, masterSymbol, tradeSymbol} = params
    const item = mockState.strategies
    .find(item =>
      item.masterSymbol === masterSymbol
      && tradeSymbol === item.tradeSymbol
      && item.exchangeAccountNumber === accountNumber)

    if (item){
      item.active = true
    }
    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifo2Strategy/tastytrade/:accountNumber/:masterSymbol/:tradeSymbol/stop`, ({ params, request }) => {
    const {accountNumber, masterSymbol, tradeSymbol} = params
    const item = mockState.strategies
    .find(item =>
      item.masterSymbol === masterSymbol
      && tradeSymbol === item.tradeSymbol
      && item.exchangeAccountNumber === accountNumber)

    if (item){
      item.active = false
    }
    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.delete(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifo2Strategy/tastytrade/:accountNumber/:masterSymbol/:tradeSymbol`, ({ params }) => {
    const {accountNumber, masterSymbol, tradeSymbol} = params
    mockState.strategies = mockState.strategies
    .filter(item =>
      !(item.masterSymbol === masterSymbol
      && tradeSymbol === item.tradeSymbol
      && item.exchangeAccountNumber === accountNumber))

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifo2Strategy/tastytrade`, async ({request}) => {
    const data = await request.json() as CreateFifo2StrategyRequest;
    mockState.strategies.push({
      active: data.active,
      entryOrderId: "",
      hasEntryOrderId: false,
      entryExchangeOrderId: "",
      entryOrderStatus: "",
      hasEntryOrderStatus: false,
      exchange: "Tastytrade",
      exchangeAccountNumber: data.exchangeAccountNumber || "",
      masterSymbol: data.tradeSymbol,
      masterSymbolAssetType: "Future",
      stopOrderId: "",
      hasStopOrderId: false,
      stopExchangeOrderId: "",
      stopOrderStatus: "",
      hasStopOrderStatus: false,
      targetOrderId: "",
      hasTargetOrderId: false,
      targetExchangeOrderId: "",
      targetOrderStatus: "",
      hasTargetOrderStatus: false,
      tradeQty: data.tradeQty,
      tradeSymbol: data.tradeSymbol,
      tradeSymbolAssetType: "Future",
      userId: "",
      waitingReset: false,
      removed: false,
    })
    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/zeroDteFlyStrategy/tastytrade/:accountNumber/:masterSymbol/stop`, ({ params, request }) => {
    const {accountNumber, masterSymbol, tradeSymbol} = params
    const item = mockState.zeroDte
    .find(item =>
      item.masterSymbol === masterSymbol
      && tradeSymbol === item.tradeSymbol
      && item.exchangeAccountNumber === accountNumber)

    if (item){
      item.active = false
    }
    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/zeroDteFlyStrategy/tastytrade/:accountNumber/:masterSymbol/forceStopExitOrder`, ({ params, request }) => {
    const {accountNumber, masterSymbol, tradeSymbol} = params
    const item = mockState.zeroDte
    .find(item =>
      item.masterSymbol === masterSymbol
      && tradeSymbol === item.tradeSymbol
      && item.exchangeAccountNumber === accountNumber)

    if (item){
      item.entryOrderStatus = "";
      item.targetOrderStatus = "";
    }
    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.delete(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/zeroDteFlyStrategy/tastytrade/:accountNumber/:masterSymbol`, ({ params }) => {
    const {accountNumber, masterSymbol, tradeSymbol} = params
    mockState.zeroDte = mockState.zeroDte
    .filter(item =>
      !(item.masterSymbol === masterSymbol
      && tradeSymbol === item.tradeSymbol
      && item.exchangeAccountNumber === accountNumber))

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.get(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/zeroDteFlyStrategy/tastytrade`, async ({ params, request }) => {

    const mockResponse = {
      "zeroDteFlyStrategyList": mockState.zeroDte
    }

    return new HttpResponse(JSON.stringify(mockResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/zeroDteFlyStrategy/tastytrade`, async ({ params, request }) => {
    const data = await request.json() as CreateZeroDteStrategyRequest;
    mockState.zeroDte.push({
      "active": true,
      "entryOrderId": "",
      "hasEntryOrderId": false,
      "entryExchangeOrderId": "",
      "hasEntryExchangeOrderId": false,
      "entryOrderStatus": "Filled",
      "hasEntryOrderStatus": false,
      "exchange": "Tastytrade",
      "exchangeAccountNumber": "5WU50943",
      "stopOrderId": "",
      "hasStopOrderId": false,
      "stopExchangeOrderId": "",
      "hasStopExchangeOrderId": false,
      "stopOrderStatus": "",
      "hasStopOrderStatus": false,
      "targetOrderId": "",
      "hasTargetOrderId": false,
      "targetExchangeOrderId": "",
      "hasTargetExchangeOrderId": false,
      "targetOrderStatus": "Working",
      "hasTargetOrderStatus": false,
      "tradeQty": {
        "units": 1,
        "nanos": 0
      },
      "userId": "2a71f4a7-591e-4892-b1c4-444160f3d329",
      "status": "Flat",
      "removed": false,
      "masterSymbol": "SPX",
      "masterSymbolAssetType": "Equity",
      "pidAddress": {
        "address": "0.0.0.0:64089",
        "id": "$7/Tastytrade.2a71f4a7-591e-4892-b1c4-444160f3d329.5WU50943.SPX"
      },
      "callLeg1StreamerSymbol": "",
      "callLeg2StreamerSymbol": "",
      "putLeg1StreamerSymbol": "",
      "putLeg2StreamerSymbol": "",
      "callLeg1Symbol": "",
      "callLeg2Symbol": "",
      "putLeg1Symbol": "",
      "putLeg2Symbol": "",
      "nextEntryTimestamp": {
        "seconds": 1731423540,
        "nanos": 0
      },
      "nextEndOfDayCloseTimestamp": null,
      "userMessage": "Strategy waiting to submit entry order at: 11/12/2024 2:59:00 PM +00:00",
      "strategySettings": data.strategySettings
    })

    return new HttpResponse(JSON.stringify({
      "active": true,
      "entryOrderId": "",
      "hasEntryOrderId": false,
      "entryExchangeOrderId": "",
      "hasEntryExchangeOrderId": false,
      "entryOrderStatus": "",
      "hasEntryOrderStatus": false,
      "exchange": "Tastytrade",
      "exchangeAccountNumber": "5WU50943",
      "stopOrderId": "",
      "hasStopOrderId": false,
      "stopExchangeOrderId": "",
      "hasStopExchangeOrderId": false,
      "stopOrderStatus": "",
      "hasStopOrderStatus": false,
      "targetOrderId": "",
      "hasTargetOrderId": false,
      "targetExchangeOrderId": "",
      "hasTargetExchangeOrderId": false,
      "targetOrderStatus": "",
      "hasTargetOrderStatus": false,
      "tradeQty": {
        "units": 1,
        "nanos": 0
      },
      "userId": "2a71f4a7-591e-4892-b1c4-444160f3d329",
      "status": "Flat",
      "removed": false,
      "masterSymbol": "SPX",
      "masterSymbolAssetType": "Equity",
      "pidAddress": {
        "address": "0.0.0.0:64089",
        "id": "$7/Tastytrade.2a71f4a7-591e-4892-b1c4-444160f3d329.5WU50943.SPX"
      },
      "callLeg1StreamerSymbol": "",
      "callLeg2StreamerSymbol": "",
      "putLeg1StreamerSymbol": "",
      "putLeg2StreamerSymbol": "",
      "callLeg1Symbol": "",
      "callLeg2Symbol": "",
      "putLeg1Symbol": "",
      "putLeg2Symbol": "",
      "nextEntryTimestamp": {
        "seconds": 1731423540,
        "nanos": 0
      },
      "nextEndOfDayCloseTimestamp": null,
      "userMessage": "Strategy waiting to submit entry order at: 11/12/2024 2:59:00 PM +00:00",
      "strategySettings": data.strategySettings
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/zeroDteFlyStrategy/tastytrade/:accountNumber/:masterSymbol/start`, ({ params }) => {
    const {accountNumber, masterSymbol, tradeSymbol} = params
    const item = mockState.zeroDte
    .find(item =>
      item.masterSymbol === masterSymbol
      && tradeSymbol === item.tradeSymbol
      && item.exchangeAccountNumber === accountNumber)

    if (item){
      item.active = true
    }
    return new HttpResponse(null, {
      status: 200
    })
  }),
]
