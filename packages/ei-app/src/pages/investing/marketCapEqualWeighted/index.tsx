import { IndexAllocationsStateStoreContext } from "@/containers/IndexModel/IndexAllocationLocalStoreContext"
import { IndexModel } from "@/containers/IndexModel/IndexModel"
import { defaultAllocationsPanelState } from "@/containers/IndexModel/IndexModel.constants"
import { ISetAllocationsState, ITabPanelData, SetAllocationsType } from "@/containers/IndexModel/IndexModel.types"
import NotificationProvider from "@/containers/IndexModel/notification-hook"
import { IndexModelingSection } from "@/containers/Investing/IndexModelingSection"
import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { clearSearchResult, searchIcons } from "@/libs/redux/Slices/IconsSlice"
import { setCapital, setTokens, updateIcons } from "@/libs/redux/Slices/MarketCapEqualWeightModelingSlice"
import {
  fetchHistoricalCapWeightedData,
  resetState,
  selectSeries,
  setCompareOption,
  setFromDate,
  setPeriod,
} from "@/libs/redux/Slices/MarketCapEqualWeightSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Stack } from "@mui/material"
import LocalStore from "devextreme/data/local_store"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function MarketCapEqualWeightedPage() {
  const {
    chartSeries,
    maxChartValue,
    minChartValue,
    period,
    yAxisTicks,
    startDate,
    symbolOption,
    statstatusFetchingMarcetCapData,
  } = useAppSelector(state => state.walletsReducer.marketCapEqualWeight)
  const [localState, setState] = useState<ISetAllocationsState>(defaultAllocationsPanelState[0])
  const [loading, setLoading] = useState<boolean>(true)
  const [setAllocationsStateStore, setSetAllocationsStateStore] = useState<ISetAllocationsState>()
  const { iconsFetchingStatus, lookUpOptions } = useAppSelector(state => state.walletsReducer.icons)

  const { tokensCount, totalCapital, weight, tableData } = useAppSelector(
    state => state.walletsReducer.MarketCapEqualWeightModeling,
  )

  const dispatch = useAppDispatch()
  const { t } = useTranslation("MarketCapEqualWeightedPage")

  const handleSetAllocationsStateUpdate = useCallback((setAllocationsState: ISetAllocationsState): void => {
    setSetAllocationsStateStore(setAllocationsState)

    if (global?.window !== undefined) {
      new LocalStore({
        key: "setAllocationsStateId",
        data: [setAllocationsState],
        name: "setAllocationsState",
      })
    }
  }, [])

  const onUpdate = useCallback((tab: SetAllocationsType, data: ITabPanelData) => {
    setState(prevState => ({
      ...prevState,
      [tab]: data,
    }))
  }, [])

  useEffect(() => {
    dispatch(resetState())
    dispatch(clearSearchResult())
    dispatch(searchIcons({}))
  }, [])

  useEffect(() => {
    if (!loading && setAllocationsStateStore) {
      if (!setAllocationsStateStore) {
        handleSetAllocationsStateUpdate(localState)
      } else {
        setState(setAllocationsStateStore)
      }
    }
  }, [handleSetAllocationsStateUpdate, loading, setAllocationsStateStore, localState])

  useEffect(() => {
    if (global?.window !== undefined) {
      // Init
      const setAllocationsStateStorage = localStorage.getItem("dx-data-localStore-setAllocationsState")
      if (setAllocationsStateStorage) {
        const parsedData = JSON.parse(setAllocationsStateStorage) as unknown as ISetAllocationsState[]
        if (parsedData && parsedData.length > 0) {
          handleSetAllocationsStateUpdate(parsedData[0])
        }
      } else {
        handleSetAllocationsStateUpdate(localState)
      }
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack>
      <NotificationProvider>
        <IndexAllocationsStateStoreContext.Provider value={setAllocationsStateStore}>
          {!loading && (
            <IndexModel
              setAllocationsState={localState}
              tabType={SetAllocationsType.EqualWeight}
              onSetAllocationsStateUpdate={handleSetAllocationsStateUpdate}
              onUpdate={onUpdate}
            />
          )}
        </IndexAllocationsStateStoreContext.Provider>
      </NotificationProvider>
      <IndexModelingSection
        onCapitalChange={value => dispatch(setCapital(value))}
        onTokensChange={value => {
          dispatch(setTokens(value))
          dispatch(updateIcons({}))
        }}
        weighted={weight * 100}
        capital={totalCapital}
        tokens={tokensCount}
        sx={{ mt: 4 }}
        isEqualWeight
        tableAssets={tableData}
        title={t("IndexModeling")}
      />

      <HistoricalWalletsWorth
        sx={{ mt: 4, width: "100%" }}
        sumbitButtonText={t("RunTest")}
        chartAxisTicks={yAxisTicks}
        chartSeries={chartSeries}
        fromDate={startDate}
        chartDataLoading={statstatusFetchingMarcetCapData === "loading"}
        lookupOption={symbolOption}
        lookupLoading={iconsFetchingStatus === "loading"}
        lookupOptions={lookUpOptions}
        maxChartValue={maxChartValue}
        minChartValue={minChartValue}
        onChartSubmit={() => dispatch(fetchHistoricalCapWeightedData({}))}
        onFromDateChange={date => dispatch(setFromDate({ fromDate: date }))}
        onLookUpSearchChange={searchValue => dispatch(searchIcons({ query: searchValue }))}
        onOptionChange={option => dispatch(setCompareOption({ compareToOption: option }))}
        onPeriodChange={period => dispatch(setPeriod({ period: period }))}
        period={period}
        onToggleSeries={index => dispatch(selectSeries({ seriesIndex: index }))}
        submitButtonDisabled={!startDate}
        title={t("ChartTitle")}
      />
    </Stack>
  )
}
