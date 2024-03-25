import { Stack } from "@mui/material"
import LocalStore from "devextreme/data/local_store"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { IndexAllocationsStateStoreContext } from "@/containers/IndexModel/IndexAllocationLocalStoreContext"
import { IndexModel } from "@/containers/IndexModel/IndexModel"
import { defaultAllocationsPanelState } from "@/containers/IndexModel/IndexModel.constants"
import { ISetAllocationsState, ITabPanelData, SetAllocationsType } from "@/containers/IndexModel/IndexModel.types"
import { LookUpOption } from "@/components/common/inputs/AppSymbolLookup/SymbolsLookup"
import { IndexModelingSection } from "@/containers/Investing/IndexModelingSection"
import { HistoricalWalletsWorth, Period } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { searchIcons } from "@/libs/redux/Slices/IconsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { assets } from "@/mocks/InvestingTableAsset"
import NotificationProvider from "@/containers/IndexModel/notification-hook"

export default function MarketCapEqualWeightedPage() {
  const [localState, setState] = useState<ISetAllocationsState>(defaultAllocationsPanelState[0])
  const [loading, setLoading] = useState<boolean>(true)
  const [setAllocationsStateStore, setSetAllocationsStateStore] = useState<ISetAllocationsState>()
  const { iconsFetchingStatus, lookUpOptions } = useAppSelector(state => state.walletsReducer.icons)
  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [period, setPeriod] = useState<Period>("daily")

  const dispatch = useAppDispatch()
  const { t } = useTranslation("MarketCapEqualWeightedPage")

  const handleSetAllocationsStateUpdate = useCallback((setAllocationsState:ISetAllocationsState):void => {
    setSetAllocationsStateStore(setAllocationsState)

    if (global?.window !== undefined) {
      new LocalStore({
        key: 'setAllocationsStateId',
        data: [setAllocationsState],
        name: 'setAllocationsState',
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
      const setAllocationsStateStorage = localStorage.getItem('dx-data-localStore-setAllocationsState')
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
        sx={{ mt: 4 }}
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
