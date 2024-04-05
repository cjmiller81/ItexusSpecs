import { IndexAllocationsStateStoreContext } from "@/containers/IndexModel/IndexAllocationLocalStoreContext"
import { IndexModel } from "@/containers/IndexModel/IndexModel"
import { defaultAllocationsPanelState } from "@/containers/IndexModel/IndexModel.constants"
import { ISetAllocationsState, ITabPanelData, SetAllocationsType } from "@/containers/IndexModel/IndexModel.types"
import { PrefilterTokensTable } from "@/containers/IndexModel/prefilter-tokens/prefilter-tokens-table/prefilter-tokens-table"
import { IndexModelingSection } from "@/containers/Investing/IndexModelingSection"
import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { createFilter, deleteFilter, fetchCoins, updateFilter } from "@/libs/redux/Slices/AllTokensTableSlice"
import { clearSearchResult, searchIcons } from "@/libs/redux/Slices/IconsSlice"
import { setCapital, setPrefilteredData, setTokens } from "@/libs/redux/Slices/MarketCapEqualWeightModelingSlice"
import {
  fetchHistoricalCapWeightedData,
  resetState,
  selectSeries,
  setCompareOption,
  setFromDate,
  setPeriod,
} from "@/libs/redux/Slices/MarketCapEqualWeightSlice"
import { appStore, useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { ICoin } from "@/services/backend-api.service"
import { Stack } from "@mui/material"
import DataSource from "devextreme/data/data_source"
import LocalStore from "devextreme/data/local_store"
import { exportDataGrid } from "devextreme/excel_exporter"
import { Workbook } from "exceljs"
import { saveAs } from "file-saver-es"
import { useCallback, useEffect, useMemo, useState } from "react"
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
  const [setAllocationsStateStore, setSetAllocationsStateStore] = useState<ISetAllocationsState>()
  const { iconsFetchingStatus, lookUpOptions } = useAppSelector(state => state.walletsReducer.icons)
  const { allTokens, allCategories, allChains, filters, fetchingTokensStatus } = useAppSelector(
    state => state.walletsReducer.allTokensTable,
  )
  const dispatch = useAppDispatch()

  const handleUpdateFilteredTokenData = (filteredTokenData: ICoin[]): void => {
    appStore.dispatch(setPrefilteredData(filteredTokenData))
  }

  const { tokensCount, totalCapital, weight, tableData } = useAppSelector(
    state => state.walletsReducer.MarketCapEqualWeightModeling,
  )

  const { t } = useTranslation("MarketCapEqualWeightedPage")

  useEffect(() => {
    dispatch(fetchCoins({}))
  }, [])

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
    if (setAllocationsStateStore) {
      if (!setAllocationsStateStore) {
        handleSetAllocationsStateUpdate(localState)
      } else {
        setState(setAllocationsStateStore)
      }
    }
  }, [handleSetAllocationsStateUpdate, setAllocationsStateStore, localState])

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allTokensSource = useMemo(
    () =>
      new DataSource<ICoin, string>({
        store: {
          type: "array",
          key: "id",
          data: allTokens,
        },
      }),
    [allTokens],
  )

  const onExporting = async (e: any): Promise<void> => {
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet("Main sheet")

    const currentDate = new Date()

    await exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    })

    await workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `TokenSets-Model-Prefilter-Tokens-${currentDate.toISOString().split("T")[0]}.xlsx`,
      )
    })
    e.cancel = true
  }

  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>()
  return (
    <Stack>
      <PrefilterTokensTable
        onDeleteFilter={id => dispatch(deleteFilter({ id }))}
        onUpdateFilter={filter => dispatch(updateFilter(filter))}
        onCreateFilter={filter => dispatch(createFilter(filter))}
        filters={filters}
        loading={fetchingTokensStatus === "loading"}
        onUpdate={handleUpdateFilteredTokenData}
        onExport={onExporting}
        categories={allCategories}
        chains={allChains}
        currentFilter={currentFilter}
        onCurrentFilterChange={filter => setCurrentFilter(filter)}
        dataSource={allTokensSource}
      />

      <IndexAllocationsStateStoreContext.Provider value={setAllocationsStateStore}>
        <IndexModel
          setAllocationsState={localState}
          tabType={SetAllocationsType.EqualWeight}
          onSetAllocationsStateUpdate={handleSetAllocationsStateUpdate}
          onUpdate={onUpdate}
        />
      </IndexAllocationsStateStoreContext.Provider>

      <IndexModelingSection
        onCapitalChange={value => dispatch(setCapital(value))}
        onTokensChange={value => {
          dispatch(setTokens(value))
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
