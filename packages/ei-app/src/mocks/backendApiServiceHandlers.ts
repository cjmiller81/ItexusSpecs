import { http, HttpResponse } from 'msw'
import { RequestHandler } from 'msw'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'

// Mock data:
import allCategories from './data/categories/all.json';

import allChains from './data/chains/all.json';

import marketCapWeightedIndexJanMarBtc8 from './data/marketCapWeightedIndex/janMarBtc8.json';

import allTokens from './data/tokens/all.json';
import btcTokens from './data/tokens-search/btc.json';
import ethTokens from './data/tokens-search/eth.json';
import { ICategory } from 'components/src/models/token/ICatigory';
import { IPlatform } from 'components/src/models/token/IPlatform';
import { ICoin } from 'components/src/models/token/ICoin';
import { IMarketCapWeightedIndex } from 'components';

//const mockState = {}

// Mock the `services/backend-api.service.ts` API requests.
export const backendApiServiceHandlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = [

  http.get(`${process.env.BACKEND_API_URL}/categories`, () => {
    const categories = allCategories as ICategory[]
    return HttpResponse.json(categories)
  }),

  http.get(`${process.env.BACKEND_API_URL}/chains`, () => {
    const chains = allChains as IPlatform[]
    return HttpResponse.json(chains)
  }),

  http.post(`${process.env.BACKEND_API_URL}/model/run/marketCapWeightedIndex`, () => {
    /*
    var url = new URL(request.url)
    let tokenCount = 8
    let startDate = new Date('2024-01-01')
    let endDate = new Date()
    let compareTokenId = 'bitcoin'

    if (url.searchParams.has('tokenCount')) {
      tokenCount = parseInt(url.searchParams.get('tokenCount') ?? '8')
    }
    if (url.searchParams.has('startDate')) {
      startDate = new Date(url.searchParams.get('startDate') ?? '2024-01-01')
    }
    if (url.searchParams.has('endDate')) {
      endDate = new Date(url.searchParams.get('endDate') ?? new Date())
    }
    if (url.searchParams.has('compareTokenId')) {
      compareTokenId = parseInt(url.searchParams.get('compareTokenId') ?? 'bitcoin')
    }

    return new HttpResponse(null, {
      status: 200
    })
    */

    const marketCapWeightedIndex = marketCapWeightedIndexJanMarBtc8 as unknown as IMarketCapWeightedIndex[]
    return HttpResponse.json(marketCapWeightedIndex)
  }),

  http.get(`${process.env.BACKEND_API_URL}/tokens`, () => {
    const coins = allTokens as ICoin[]
    return HttpResponse.json(coins)
  }),

  http.get(`${process.env.BACKEND_API_URL}/tokens-search`, ({ request }) => {
    var url = new URL(request.url)
    if (url.searchParams.has('query')) {
      const symbolQuery = url.searchParams.get('query') ?? ''
      if (symbolQuery?.indexOf('btc') > -1) {
        const coins = btcTokens as ICoin[]
        return HttpResponse.json(coins)
      } else if (symbolQuery?.indexOf('eth') > -1) {
        const coins = ethTokens as ICoin[]
        return HttpResponse.json(coins)
      } else {
        const coins = allTokens as ICoin[]
        return HttpResponse.json(coins)
      }
    }

    return new HttpResponse(null, {
      status: 200
    })
  }),
]
