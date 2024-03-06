import { http, HttpResponse } from 'msw'
import { RequestHandler } from 'msw'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'

// Mock the `services/useACF.ts` API requests.
export const useACFWordPressServiceHandlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = [
  http.post(`${process.env.REACT_APP_SVT_WORDPRESS_API_URL as string}/api-bearer-auth/v1/login`, () => {
    return new HttpResponse(null, {
      status: 200
    })
  }),

  http.get(`${process.env.REACT_APP_SVT_WORDPRESS_API_URL as string}/wp/v2/users/*`, () => {
    return HttpResponse.json({
      "acf": {
        "user_position": [
          {
            "id": "e38e7c6f-9ecd-4e64-91b8-7ae57bda39de",
            "symbol": "AAPL",
            "quantity": 1,
            "trade_type": "shares",
            "strike_price": 0,
            "call_put": false,
            "expiration": "20240524",
            "trade_price": 170.01,
            "date_entered": "20240524"
          },
          {
            "id": "616369da-0dac-4b31-9c02-d8a1431add7b",
            "symbol": "IBM",
            "quantity": 1,
            "trade_type": "shares",
            "strike_price": 0,
            "call_put": false,
            "expiration": "20240524",
            "trade_price": 29.02,
            "date_entered": "20240524"
          }
        ],
        "current_account_value": 10001,
        "user_trading_plan": 30708
      }
    })
  }),

  http.post(`${process.env.REACT_APP_SVT_WORDPRESS_API_URL as string}/wp/v2/users/*`, () => {
    return HttpResponse.json({
      "acf": {
        "user_position": [
          {
            "id": "e38e7c6f-9ecd-4e64-91b8-7ae57bda39de",
            "symbol": "AAPL",
            "quantity": 1,
            "trade_type": "shares",
            "strike_price": 0,
            "call_put": false,
            "expiration": "20240524",
            "trade_price": 170.01,
            "date_entered": "20240524"
          },
          {
            "id": "616369da-0dac-4b31-9c02-d8a1431add7b",
            "symbol": "IBM",
            "quantity": 1,
            "trade_type": "shares",
            "strike_price": 0,
            "call_put": false,
            "expiration": "20240524",
            "trade_price": 29.02,
            "date_entered": "20240524"
          }
        ],
        "current_account_value": 10001,
        "user_trading_plan": 30708
      }
    })
  }),

  http.get(`${process.env.REACT_APP_SVT_WORDPRESS_API_URL as string}/wp/v2/ivl-trade-plans/*`, () => {
    return HttpResponse.json({
      "acf": {
        "trading_plan_settings": [
          {
            "health_tool_type": "notional_exposure",
            "health_tool_title": "Test Health Tool Title",
            "level_max": 70,
            "level_75": 60,
            "level_mid": 45,
            "level_25": 30,
            "level_min": 10,
            "suffix_symbol": "FOO",
          }
        ],
        "trading_plan_title": "Test Trade Plan"
      }
    })
  }),
]
