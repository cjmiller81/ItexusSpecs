import { RateLimiter } from 'limiter'
import CustomStore from 'devextreme/data/custom_store'
import { LoadOptions } from 'devextreme/data'

export const backendApiUrl = process.env.BACKEND_API_URL ?? 'http://127.0.0.1:5000'

async function sleep(ms:number = 1):Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface IExchange {
  id: string
  name: string
  market_type?: string
  logoURI?: string
}

export interface ICoinGeckoSearchResults {
  coins: ICoin[]
  exchanges: IExchange[]
  categories: ICategory[]
}

export interface ICategory {
  category_id: string
  name: string
}
export interface IPlatform {
  id: string
  chain_identifier: number
  name: string
  shortname: string
}

export interface ICoin {
  id: string
  sym: string
  name: string
  api_symbol?: string
  market_cap_rank?: number
  lURI?: string
}

export interface ICoinMarketData {
  current_price: Record<string, number>
  market_cap: Record<string, number>
  total_volume: Record<string, number>
  fully_diluted_valuation: Record<string, number>
  total_supply: number | null
  max_supply: number | null
  circulating_supply: number | null
}

export interface ICoinDetails {
  id: string
  symbol: string
  name: string
  platforms: Record<string, string>
  categories: string[]
  market_data: ICoinMarketData
}

export const NoCoin = {
  id: "",
  sym: "-",
  name: "No Selection",
  api_symbol: "",
  market_cap_rank: 0,
  lURI: "/static/images/empty-set.png",
} as ICoin

export interface IPrefilterTokensFilterValues {
  id: string
  text: string
  description?: string | null
  icon: string | null
  isPublic: boolean
  OwnerUserId?: string | null
  isPublished: boolean
  accessPlanName?: string | null
  filter: string | object[]
}

export interface IMarketCapWeightedIndex {
  capWeightedDate: Date,
  capWeightedIndex: number,
  capEqualWeightedIndex: number,
  comparePrice: number,
}

const API_REQUEST_PER_MINUTE = 500
const RATE_LIMITER = new RateLimiter({
  tokensPerInterval: API_REQUEST_PER_MINUTE,
  interval: 'minute'
})

export class BackendApiService {
  public static SymbolLookupDataSource = new CustomStore({
    key: 'id',
    loadMode: 'raw',
    load: (loadOptions: LoadOptions) => {
      const searchQuery = (loadOptions.searchValue) ? `?query=${loadOptions.searchValue}` : ""

      let url = new URL(`${backendApiUrl}/tokens-search${searchQuery}`)

      return this.createApiRequest(url.toString())
        .then(req => {
          return fetch(req as Request, {
            method: 'GET',
          })
        })
        .then(response => {
          if (response.status >= 400) {
            if (response.statusText === 'Too Many Requests') {
              console.error(`Failed to fetch: ${url.toString()}\n${response.statusText}\nTry again`)
            } else {
              throw new Error(`Failed to fetch: ${url.toString()}\n${response.statusText}`)
            }
          }

          return response.json()
        })
        .then((searchResults: ICoin[]) => {
          if (searchResults) {
            if (loadOptions.skip && loadOptions.take) {
              return searchResults.slice(loadOptions.skip, (loadOptions.skip + loadOptions.take))
            }

            return [...[NoCoin], ...searchResults]
          }

          return []
        })
    },

    byKey: (key: any) => {
      let url = new URL(`${backendApiUrl}/tokens/${key}`)

      if (!key || key === "") {
        return Promise.resolve(NoCoin)
      }

      return this.createApiRequest(url.toString())
      .then(req => {
        return fetch(req as Request, {
          method: 'GET',
        })
      })
      .then(response => {
        if (response.status >= 400) {
          if (response.statusText === 'Too Many Requests') {
            console.error(`Failed to fetch: ${url.toString()}\n${response.statusText}\nTry again`)
          } else {
            throw new Error(`Failed to fetch: ${url.toString()}\n${response.statusText}`)
          }
        }

        return response.json()
      })
      .then(coinData => {
        if (coinData) {
          return {
            id: coinData.id,
            name: coinData.name,
            sym: coinData.sym,
            lURI: coinData.lURI ? coinData.lURI : "",
          } as ICoin
        }

        return {}
      })
    },
  })

  /**
   * Get all Coin Gecko Categories.
   * @see https://www.coingecko.com/en/api/documentation
   *
   * @param {number} [retries=0] - When API rate limits request, number of retries being made.
   * @returns {Promise<ICategory[]>} - Array of Coin Market data.
   */
	public async getAllCategories(retries:number = 0):Promise<ICategory[]> {
    let data = [] as ICategory[]

    try {
      let url = new URL(`${backendApiUrl}/categories`)

      let req = await BackendApiService.createApiRequest(url.toString())
        .catch(error => {
          console.error(error)
        })

      console.log(`Fetching: ${url}`)
      let response = await fetch(req as Request, {
        method: 'GET',
      })

      if (response.status >= 400) {
        if (response.statusText === 'Too Many Requests' && retries < 30) {
          console.error(`Failed to fetch: ${url.toString()}\n${response.statusText}\nTrying again...`)
          data = await this.getAllCategories(retries + 1)
        } else {
          throw new Error(`Failed to fetch: ${url.toString()}\n${response.statusText}`)
        }
      } else {
        data = await response.json() as unknown as ICategory[]
      }
    } catch (err) {
      console.error(err)
    }

    return data
  }

  /**
   * Get all Coin Gecko Chains/Platforms.
   * @see https://www.coingecko.com/en/api/documentation
   *
   * @param {number} [retries=0] - When API rate limits request, number of retries being made.
   * @returns {Promise<IPlatform[]>} - Array of Coin Market data.
   */
	public async getAllChains(retries:number = 0):Promise<IPlatform[]> {
    let data = [] as IPlatform[]

    try {
      let url = new URL(`${backendApiUrl}/chains`)

      let req = await BackendApiService.createApiRequest(url.toString())
        .catch(error => {
          console.error(error)
        })

      console.log(`Fetching: ${url}`)
      let response = await fetch(req as Request, {
        method: 'GET',
      })

      if (response.status >= 400) {
        if (response.statusText === 'Too Many Requests' && retries < 30) {
          console.error(`Failed to fetch: ${url.toString()}\n${response.statusText}\nTrying again...`)
          data = await this.getAllChains(retries + 1)
        } else {
          throw new Error(`Failed to fetch: ${url.toString()}\n${response.statusText}`)
        }
      } else {
        data = await response.json() as unknown as IPlatform[]
      }
    } catch (err) {
      console.error(err)
    }

    return data
  }

  /**
   * Get all Coin Gecko Tokens.
   * @see https://www.coingecko.com/en/api/documentation
   *
   * @param {number} [retries=0] - When API rate limits request, number of retries being made.
   * @returns {Promise<ICoin[]>} - Array of Coin Market data.
   */
	public async getAllTokens(retries:number = 0):Promise<ICoin[]> {
    let data = [] as ICoin[]

    try {
      let url = new URL(`${backendApiUrl}/tokens`)

      let req = await BackendApiService.createApiRequest(url.toString())
        .catch(error => {
          console.error(error)
        })

      console.log(`Fetching: ${url}`)
      let response = await fetch(req as Request, {
        method: 'GET',
      })

      if (response.status >= 400) {
        if (response.statusText === 'Too Many Requests' && retries < 30) {
          console.error(`Failed to fetch: ${url.toString()}\n${response.statusText}\nTrying again...`)
          data = await this.getAllTokens(retries + 1)
        } else {
          throw new Error(`Failed to fetch: ${url.toString()}\n${response.statusText}`)
        }
      } else {
        data = await response.json() as unknown as ICoin[]
      }
    } catch (err) {
      console.error(err)
    }

    return data
  }

  /**
   * Get a single CoinGecko Token/Coin historical data (price, market cap, 24hr volume, ..) at a given date.
   * @see https://www.coingecko.com/en/api/documentation
   *
   * @param {string} [token=''] - The coin symbol to get.
   * @param {Date} [date=''] - The date of price data snapshot to get.
   * @param {number} [retries=0] - When API rate limits request, number of retries being made.
   * @returns {Promise<ICoinDetails>} - Array of Coin Market data.
   */
	public async getTokenPriceHistory(token: string, date: Date, retries:number = 0):Promise<ICoinDetails> {
    let data = {} as ICoinDetails

    try {
      let url = new URL(`${backendApiUrl}/tokens-history/${token}`)

      //const yyyy = date.getFullYear()
      //let mm = date.getMonth() + 1 // Months start at 0!
      //let dd = date.getDate()
      //const formattedDate = `${yyyy}-${mm}-${dd}`

      const offset = date.getTimezoneOffset()
      date = new Date(date.getTime() - (offset*60*1000))
      const formattedDate = date.toISOString().split('T')[0]

      url.searchParams.append('date', formattedDate)

      let req = await BackendApiService.createApiRequest(url.toString())
        .catch(error => {
          console.error(error)
        })

      console.log(`Fetching: ${url}`)
      let response = await fetch(req as Request, {
        method: 'GET',
      })

      if (response.status >= 400) {
        if (response.statusText === 'Too Many Requests' && retries < 30) {
          console.error(`Failed to fetch: ${url.toString()}\n${response.statusText}\nTrying again...`)
          data = await this.getTokenPriceHistory(token, date, retries + 1)
        } else {
          throw new Error(`Failed to fetch: ${url.toString()}\n${response.statusText}`)
        }
      } else {
        data = await response.json() as unknown as ICoinDetails
      }
    } catch (err) {
      console.error(err)
    }

    return data
  }

  /**
   * Get the Market Cap Weighted Index's historical data for a given date range.
   *
   * @param {number} [tokenCount=''] - The number of tokens in the model index.
   * @param {Date} [startDate=''] - The start date of Market Cap Weighted data to get.
   * @param {Date} [endDate=''] - The end date of Market Cap Weighted data to get.
   * @param {number} [retries=0] - When API rate limits request, number of retries being made.
   * @returns {Promise<IMarketCapWeightedIndex[]>} - Array of Market Cap Weighted Index data.
   */
	public async getMarketCapWeightedIndexHistory(tokenCount: number, startDate: Date, endDate: Date, compareSymbolId: string = '', retries: number = 0):Promise<IMarketCapWeightedIndex[]> {
    let data = [] as IMarketCapWeightedIndex[]

    try {
      let url = new URL(`${backendApiUrl}/model/run/marketCapWeightedIndex`)

      url.searchParams.append('tokenCount', tokenCount.toString())

      //const startyyyy = startDate.getFullYear()
      //let startmm = startDate.getMonth() + 1 // Months start at 0!
      //let startdd = startDate.getDate()
      //const startFormattedDate = `${startyyyy}-${startmm}-${startdd}`

      const offset = startDate.getTimezoneOffset()
      startDate = new Date(startDate.getTime() - (offset*60*1000))
      const startFormattedDate = startDate.toISOString().split('T')[0]

      url.searchParams.append('startDate', startFormattedDate)

      //const endyyyy = endDate.getFullYear()
      //let endmm = endDate.getMonth() + 1 // Months start at 0!
      //let enddd = endDate.getDate()
      //const endFormattedDate = `${endyyyy}-${endmm}-${enddd}`

      const endOffset = endDate.getTimezoneOffset()
      endDate = new Date(endDate.getTime() - (endOffset*60*1000))
      const endFormattedDate = endDate.toISOString().split('T')[0]

      url.searchParams.append('endDate', endFormattedDate)

      if (compareSymbolId && compareSymbolId.length > 0) {
        url.searchParams.append('compareTokenId', compareSymbolId)
      }

      let req = await BackendApiService.createApiRequest(url.toString())
        .catch(error => {
          console.error(error)
        })

      console.log(`Fetching: ${url}`)
      let response = await fetch(req as Request, {
        method: 'GET',
      })

      if (response.status >= 400) {
        if (response.statusText === 'Too Many Requests' && retries < 30) {
          console.error(`Failed to fetch: ${url.toString()}\n${response.statusText}\nTrying again...`)
          data = await this.getMarketCapWeightedIndexHistory(tokenCount, startDate, endDate, compareSymbolId, retries + 1)
        } else {
          throw new Error(`Failed to fetch: ${url.toString()}\n${response.statusText}`)
        }
      } else {
        data = await response.json() as unknown as IMarketCapWeightedIndex[]
      }
    } catch (err) {
      console.error(err)
    }

    return data
  }

  /**
   * @param {IPrefilterTokensFilterValues} [filter] - When API rate limits request, number of retries being made.
   * @param {number} [retries=0] - When API rate limits request, number of retries being made.
   * @returns {Promise<boolean>} - True if filter was created successfully.
   */
	public async createTokensFilters(filter: IPrefilterTokensFilterValues, retries:number = 0):Promise<boolean> {
    try {
      let url = new URL(`${backendApiUrl}/tokens-filters`)

      let req = await BackendApiService.createApiRequest(url.toString())
        .catch(error => {
          console.error(error)
        }) as Request

      req.headers.append("Content-Type", "application/json")

      console.log(`Fetching: ${url}`)
      let response = await fetch(req as Request, {
        method: 'POST',
        body: JSON.stringify(filter)
      })

      if (response.status >= 400) {
        if (response.statusText === 'Too Many Requests' && retries < 30) {
          console.error(`Failed to fetch: ${url.toString()}\n${response.statusText}\nTrying again...`)
          return await this.createTokensFilters(filter, retries + 1)
        } else {
          throw new Error(`Failed to fetch: ${url.toString()}\n${response.statusText}`)
        }
      } else {
        if (response.ok) {
          return true
        }
      }
    } catch (err) {
      console.error(err)
    }

    return false
  }

  /**
   * @param {number} [retries=0] - When API rate limits request, number of retries being made.
   * @returns {Promise<IPrefilterTokensFilterValues[]>} - Array of Prefilter Tokens Filter Values data.
   */
	public async getTokensFilters(retries:number = 0):Promise<IPrefilterTokensFilterValues[]> {
    let data = [] as IPrefilterTokensFilterValues[]

    try {
      let url = new URL(`${backendApiUrl}/tokens-filters`)

      let req = await BackendApiService.createApiRequest(url.toString())
        .catch(error => {
          console.error(error)
        })

      console.log(`Fetching: ${url}`)
      let response = await fetch(req as Request, {
        method: 'GET',
      })

      if (response.status >= 400) {
        if (response.statusText === 'Too Many Requests' && retries < 30) {
          console.error(`Failed to fetch: ${url.toString()}\n${response.statusText}\nTrying again...`)
          data = await this.getTokensFilters(retries + 1)
        } else {
          throw new Error(`Failed to fetch: ${url.toString()}\n${response.statusText}`)
        }
      } else {
        if (response.ok) {
          data = await response.json() as unknown as IPrefilterTokensFilterValues[]

          for (let i =0; i < data.length; i++) {
            data[i].filter = JSON.parse(data[i].filter.toString())
          }
        }
      }
    } catch (err) {
      console.error(err)
    }

    return data
  }

  /**
   * @param {string} [id] - Filter id to delete.
   * @param {number} [retries=0] - When API rate limits request, number of retries being made.
   * @returns {Promise<boolean>} - Array of Prefilter Tokens Filter Values data.
   */
	public async deleteTokensFilters(id: string, retries:number = 0):Promise<boolean> {
    try {
      let url = new URL(`${backendApiUrl}/tokens-filters/${id}`)

      let req = await BackendApiService.createApiRequest(url.toString())
        .catch(error => {
          console.error(error)
        })

      console.log(`Deleting: ${url}`)
      let response = await fetch(req as Request, {
        method: 'DELETE',
      })

      if (response.status >= 400) {
        if (response.statusText === 'Too Many Requests' && retries < 30) {
          console.error(`Failed to delete: ${url.toString()}\n${response.statusText}\nTrying again...`)
          return await this.deleteTokensFilters(id, retries + 1)
        } else {
          throw new Error(`Failed to delete: ${url.toString()}\n${response.statusText}`)
        }
      } else {
        if (response.ok) {
          return true
        }
      }
    } catch (err) {
      console.error(err)
    }

    return false
  }

  /**
   * Create an HTTP Request object for calling the CoinGecko API. Apply rate limiting to prevent too
   * many requests per minute. Add the CoinGecko API Token to the URL query string if the Pro API
   * is being used.
   *
   * @param {string} [url=''] - The full URL to request.
   * @param {boolean} [waiting=false] - Flag to set to skip `RATE_LIMITER.removeTokens(1)` when
   *                                    retrying arate limited request.
   * @returns {Promise<Request>} - The HTTP Request object.
   */
  protected static async createApiRequest(url: string, waiting: boolean = false):Promise<Request> {
    const remainingTokens = await new Promise<number>((resolve, reject) => {
      if (waiting) {
        resolve(RATE_LIMITER.getTokensRemaining())
      } else {
          RATE_LIMITER.removeTokens(1)
          .then((theRemainingTokens: number) => {
            resolve(theRemainingTokens)
          })
          .catch((error: any) => {
            reject(error)
          })
      }
    })

    if (remainingTokens < 1) {
      console.log(`API request limit of ${API_REQUEST_PER_MINUTE}/minute reached. Trying again in 5 seconds...`)
      await sleep(5.0 * 1000)

      return this.createApiRequest(url, true)
    }

    console.log(`API request limit remainingTokens: ${remainingTokens}`)

    url = this.addCookieToApiRequest(url)
    const req = new Request(url, {
      credentials: 'include',
    })

    return req
  }

  /**
   * Add the CoinGecko API Token to the query string of the URL if the Pro API is used.
   *
   * @param {string} [url=''] - The full URL to request.
   * @returns {string} - The full URL to request with the CoinGecko API Token added if Pro API is used.
   */
  protected static addCookieToApiRequest(url: string): string {
    let reqUrl = new URL(url)

    return reqUrl.toString()
  }
}

export default new BackendApiService()
