import { AppAccordionSection } from "@/components/common/Containers/AppAccordionSection"
import { IndexModelingSection } from "@/containers/Investing/IndexModelingSection"
import PrefilterTokensSection from "@/containers/Investing/PrefilterTokensSection"
import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { fetchCoins } from "@/libs/redux/Slices/AllTokensTableSlice"
import { clearSearchResult, searchIcons } from "@/libs/redux/Slices/IconsSlice"
import {
  fetchHistoricalCapWeightedData,
  resetState,
  selectSeries,
  setCompareOption,
  setFromDate,
  setPeriod,
  setToDate,
} from "@/libs/redux/Slices/MarketCapWeightedChartSlice"
import { setCapital, setPrefilteredData, setTokens } from "@/libs/redux/Slices/MarketCapWeightedModelingSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Stack } from "@mui/material"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function MarketCapWeightedPage() {
  const {
    chartSeries,
    maxChartValue,
    minChartValue,
    period,
    yAxisTicks,
    startDate,
    symbolOption,
    statstatusFetchingMarcetCapData,
    endDate
  } = useAppSelector(state => state.walletsReducer.marketCapWeightedChart)
  const { iconsFetchingStatus, lookUpOptions } = useAppSelector(state => state.walletsReducer.icons)
  const dispatch = useAppDispatch()

  const { tokensCount, totalCapital, weight, tableData } = useAppSelector(
    state => state.walletsReducer.MarketCapWeightedModeling,
  )

  const { t } = useTranslation("MarketCapPage")

  useEffect(() => {
    dispatch(resetState())
    dispatch(clearSearchResult())
    dispatch(searchIcons({}))
    dispatch(fetchCoins({}))
  }, [])

  return (
    <Stack gap={2}>
      <PrefilterTokensSection
        onFilteredTokensChanged={filteredTokenData => dispatch(setPrefilteredData(filteredTokenData))}
      />

      <IndexModelingSection
        onCapitalChange={value => dispatch(setCapital(value))}
        onTokensChange={value => {
          dispatch(setTokens(value))
        }}
        weighted={weight * 100}
        capital={totalCapital}
        tokens={tokensCount}
        tableAssets={tableData}
        title={t("IndexModeling")}
      />

      <AppAccordionSection
        persistKey="HistoricalWalletsWorth"
        defaultExpanded
        title={t("WeightedChartTitle")}>
        <HistoricalWalletsWorth
          toDate={endDate}
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
          onToDateChange={date => dispatch(setToDate({ toDate: date }))}
          onFromDateChange={date => dispatch(setFromDate({ fromDate: date }))}
          onLookUpSearchChange={searchValue => dispatch(searchIcons({ query: searchValue }))}
          onOptionChange={option => dispatch(setCompareOption({ compareToOption: option }))}
          onPeriodChange={period => dispatch(setPeriod({ period: period }))}
          period={period}
          onToggleSeries={index => dispatch(selectSeries({ seriesIndex: index }))}
          submitButtonDisabled={!startDate}
          title={""}
        />
      </AppAccordionSection>
    </Stack>
  )
}
