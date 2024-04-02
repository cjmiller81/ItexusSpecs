import { LookUpOption } from "@/components/common/inputs/AppSymbolLookup/SymbolsLookup"
import { IndexModelingSection } from "@/containers/Investing/IndexModelingSection"
import { HistoricalWalletsWorth, Period } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { clearSearchResult, searchIcons } from "@/libs/redux/Slices/IconsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { assets } from "@/mocks/InvestingTableAsset"
import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function MarketCapWeightedPage() {
  const { t } = useTranslation("MarketCapWeightedPage")

  const { iconsFetchingStatus, lookUpOptions } = useAppSelector(state => state.walletsReducer.icons)
  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [period, setPeriod] = useState<Period>("daily")
  const dispatch = useAppDispatch()
  const [capital, setCapital] = useState(120)
  const [tokensCount, setTokensCount] = useState(120)
  useEffect(() =>{
    dispatch(clearSearchResult());
    dispatch(searchIcons({}));
  },[])
  
  console.log(iconsFetchingStatus);
  return (
    <Stack>
      <IndexModelingSection
        capital={capital}
        onCapitalChange={capital => setCapital(capital)}
        onTokensChange={tokens => setTokensCount(tokens)}
        tokens={tokensCount}
        weighted={1 / capital}
        sx={{mt: 4}}
        tableAssets={assets}
        title={t("IndexModeling")}
      />
      <HistoricalWalletsWorth
        sx={{ mt: 4, width: "100%" }}
        chartAxisTicks={6}
        chartSeries={[]}
        fromDate={fromDate}
        lookupOption={symbolOption}
        lookupLoading={iconsFetchingStatus === "loading"}
        lookupOptions={lookUpOptions}
        maxChartValue={10}
        minChartValue={0}
        onChartSubmit={() => {}}
        onFromDateChange={date => setFromDate(date)}
        onLookUpSearchChange={searchValue => dispatch(searchIcons({ query: searchValue }))}
        onOptionChange={option => setSymbolOption(option)}
        onPeriodChange={period => setPeriod(period)}
        period={period}
        onToggleSeries={() => {}}
        submitButtonDisabled={true}
        title={t("ChartTitle")}
      />
    </Stack>
  )
}
