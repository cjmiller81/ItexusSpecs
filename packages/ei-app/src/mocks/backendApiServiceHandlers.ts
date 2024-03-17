import { http, HttpResponse } from 'msw'
import { RequestHandler } from 'msw'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'
import { backendApiUrl, ICoin } from '@/services/backend-api.service'

//const mockState = {}

// Mock the `services/tradingPlatformService.ts` API requests.
export const backendApiServiceHandlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = [
  http.get(`${backendApiUrl as string}/tokens-search`, ({ request }) => {
    if (request.url.indexOf('btc') > -1) {
      const coins = [
        {
          id: 'bitcoin',
          sym: 'btc',
          name: 'Bitcoin',
          api_symbol: 'bitcoin',
          market_cap_rank: 1,
          lURI: ''
        },
      ] as ICoin[]

      return HttpResponse.json(coins)
    }

    return new HttpResponse(null, {
      status: 200
    })
  }),
]
