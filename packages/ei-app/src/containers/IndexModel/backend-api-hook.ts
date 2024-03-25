// eslint-disable-next-line import/no-named-as-default
import BackendApiService from '@/services/backend-api.service'

export interface IBackendApiHook {
  fetchData(): Promise<void>
}

export function useBackendApi(): IBackendApiHook {
  const fetchData = async(): Promise<void> => {
    // Clean up old localStorage. Remove this in the future after KVK has run it.
    if (localStorage.getItem('top100Tokens')) {
      localStorage.removeItem('top100Tokens')
    }
    if (localStorage.getItem('coinGeckoAllTokens')) {
      localStorage.removeItem('coinGeckoAllTokens')
    }
    if (localStorage.getItem('coinGeckoERC20Tokens')) {
      localStorage.removeItem('coinGeckoERC20Tokens')
    }
    if (localStorage.getItem('dx-data-localStore-equalWeightPositionTableData')) {
      localStorage.removeItem('dx-data-localStore-equalWeightPositionTableData')
    }

    // We want to keep the one, but it may have invalid `categories` reference that should be `cats`.
    const weightedPrefilterTokensFilterValues = localStorage.getItem('weightedPrefilterTokensFilterValues')
    if (weightedPrefilterTokensFilterValues
      && (weightedPrefilterTokensFilterValues.indexOf("categories") > -1
        || weightedPrefilterTokensFilterValues.indexOf("tokenomics") > -1
      )
    ) {
      localStorage.removeItem('weightedPrefilterTokensFilterValues')
    }

    const categories = await BackendApiService.getAllCategories()
    localStorage.setItem('coinGeckoCategories', JSON.stringify(categories))

    const chains = await BackendApiService.getAllChains()
    localStorage.setItem('coinGeckoChains', JSON.stringify(chains))

    const allTokens = await BackendApiService.getAllTokens()
    // TODO: Loop over results and map to shorter property strings?
    localStorage.setItem('dx-data-localStore-prefilterTokensTable', JSON.stringify(allTokens))
  }

  return {
    fetchData,
  }
}
