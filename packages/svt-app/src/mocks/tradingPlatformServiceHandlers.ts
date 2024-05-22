import { http, HttpResponse } from 'msw'
import { RequestHandler } from 'msw'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'
import { CreateFifoStrategyRequest, FifoStrategyListItem, FifoStrategyListResponse, IvlRiskTolerance, SvtIvlEsStrategySetStatus, SvtIvlStrategyAccountConnect } from '../services/tradingPlatformService'


const mockState :{
  connected: boolean,
  strategies: FifoStrategyListItem[]
  status: any
} = {
  connected: false,
  strategies: [],
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
    capitalAllocation: 0,
    capitalAllocationStart: 15000.00,
    capitalAllocationNext: 15000.00,
    contractQty: 1,
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

  http.get(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/accounts`, () => {
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

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/svt/ivl/es`, async ({ request }) => {
    if (request.body) {
      const data = await request.json() as SvtIvlStrategyAccountConnect;

      if (data) {
        if (data.closingOnly !== mockState.status.closingOnly && !mockState.status.isStarted) {
          mockState.status.closingOnly = data.closingOnly
        } else {
          mockState.status.isStarted = true
          mockState.status.closingOnly = data.closingOnly
          mockState.status.capitalAllocation = data.capitalAllocation === 0 ? data.capitalAllocationNext : data.capitalAllocation
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

  http.get(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/svt/ivl/es`, () => {
    if (mockState.connected) {
      return HttpResponse.json({
        "isStarted": mockState.status.isStarted,
        "entryOrderId": mockState.status.entryOrderId,
        "entryOrderStatus": mockState.status.entryOrderStatus,
        "entryOrderSymbol": mockState.status.entryOrderSymbol,
        "exitOrderId": mockState.status.exitOrderId,
        "exitOrderStatus": mockState.status.exitOrderStatus,
        "exitOrderSymbol": mockState.status.exitOrderSymbol,
        "exchangeUsername": "benec",
        "accountNumber": "5WU50943",
        "riskTolerance": "High",
        "capitalAllocation": mockState.status.capitalAllocation,
        "capitalAllocationStart": mockState.status.capitalAllocationStart,
        "capitalAllocationNext": mockState.status.capitalAllocationNext,
        "closingOnly": mockState.status.closingOnly,
        "contractQty": mockState.status.contractQty,
      })
    }

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/svt/ivl/es/stop`, () => {
    mockState.status.isStarted = false

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.get(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifoStrategy/tastytrade`, () => {
    const response: FifoStrategyListResponse = {
      fifoStrategyList_: mockState.strategies
    }
    return HttpResponse.json(JSON.stringify(response))
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifoStrategy/tastytrade/:accountNumber/:masterSymbol/:tradeSymbol/start`, ({ params }) => {
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

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifoStrategy/tastytrade/:accountNumber/:masterSymbol/:tradeSymbol/stop`, ({ params, request }) => {
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

  http.delete(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifoStrategy/tastytrade/:accountNumber/:masterSymbol/:tradeSymbol`, ({ params }) => {
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

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifoStrategy/tastytrade`, async ({request}) => {
    const data = await request.json() as CreateFifoStrategyRequest;
    mockState.strategies.push({
      active: data.active,
      atrPeriod: 14,
      capitalAllocation: 0,
      entryOrderId: "",
      hasEntryOrderId: false,
      entryOrderStatus: "",
      hasEntryOrderStatus: false,
      exchange: "Tastytrade",
      exchangeAccountNumber: data.exchangeAccountNumber || "",
      masterSymbol: data.tradeSymbol,
      masterSymbolAssetType: "Future",
      stopOrderId: "",
      hasStopOrderId: false,
      stopOrderStatus: "",
      hasStopOrderStatus: false,
      targetOrderId: "",
      hasTargetOrderId: false,
      targetOrderStatus: "",
      hasTargetOrderStatus: false,
      tradeQty: data.tradeQty,
      tradeSymbol: data.tradeSymbol,
      tradeSymbolAssetType: "Future",
      userId: ""
    })
    return new HttpResponse(null, {
      status: 200
    })
  }),
]
