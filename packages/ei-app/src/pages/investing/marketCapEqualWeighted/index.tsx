import { AppAccordionSection } from "@/components/common/Containers/AppAccordionSection"
import { IndexModelingSection } from "@/containers/Investing/IndexModelingSection"
import PrefilterTokensSection from "@/containers/Investing/PrefilterTokensSection"
import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { fetchCoins } from "@/libs/redux/Slices/AllTokensTableSlice"
import { clearSearchResult, searchIcons } from "@/libs/redux/Slices/IconsSlice"
import { setCapital, setTokens } from "@/libs/redux/Slices/MarketCapEqualWeightModelingSlice"
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
import { useEffect } from "react"
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
  const { iconsFetchingStatus, lookUpOptions } = useAppSelector(state => state.walletsReducer.icons)
  const dispatch = useAppDispatch()

  const { tokensCount, totalCapital, weight, tableData } = useAppSelector(
    state => state.walletsReducer.MarketCapEqualWeightModeling,
  )

  const { t } = useTranslation("MarketCapEqualWeightedPage")

  useEffect(() => {
    dispatch(resetState())
    dispatch(clearSearchResult())
    dispatch(searchIcons({}))
    dispatch(fetchCoins({}))
  }, [])

  return (
    <Stack gap={2}>
      <PrefilterTokensSection />

      <IndexModelingSection
        onCapitalChange={value => dispatch(setCapital(value))}
        onTokensChange={value => {
          dispatch(setTokens(value))
        }}
        weighted={weight * 100}
        capital={totalCapital}
        tokens={tokensCount}
        isEqualWeight
        tableAssets={tableData}
        title={t("IndexModeling")}
      />

      <AppAccordionSection
        persistKey="HistoricalWalletsWorth"
        defaultExpanded
        title={t("ChartTitle")}>
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
          title={""}
        />
      </AppAccordionSection>
    </Stack>
  )
}
