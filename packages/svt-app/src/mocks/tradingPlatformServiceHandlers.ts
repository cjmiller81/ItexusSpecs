import { http, HttpResponse } from 'msw'
import { RequestHandler } from 'msw'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'

const mockState = {
  connected: false,
  started: false,
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

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/svt/ivl/es`, () => {
    mockState.started = true

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.get(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/svt/ivl/es`, () => {
    if (mockState.connected) {
      return HttpResponse.json({
        "isStarted": mockState.started,
        "entryOrderId": "131083",
        "entryOrderStatus": "Filled",
        "entryOrderSymbol": "AAPL",
        "exitOrderId": "131084",
        "exitOrderStatus": "Working",
        "exitOrderSymbol": "AAPL",
        "exchangeUsername": "benec",
        "accountNumber": "5WU50943",
        "riskTolerance": "High",
        "capitalAllocation": "15000.00",
        "capitalAllocationNext": "15000.00",
        "closingOnly": false
      })
    }

    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/svt/ivl/es/stop`, () => {
    mockState.started = false

    return new HttpResponse(null, {
      status: 200
    })
  }),
]
