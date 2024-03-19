
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Stack } from "@mui/material"
import LocalStore from 'devextreme/data/local_store'

import { IndexModel } from "@/containers/IndexModel/IndexModel"
import { IndexModelingSection } from "@/containers/Investing/IndexModelingSection"
import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { ISetAllocationsState, ITabPanelData, SetAllocationsType } from "@/containers/IndexModel/IndexModel.types"
import { IndexAllocationsStateStoreContext } from "@/containers/IndexModel/IndexAllocationLocalStoreContext"
import { defaultAllocationsPanelState } from "@/containers/IndexModel/IndexModel.constants"
import { assets } from "@/mocks/InvestingTableAsset"

export default function MarketCapEqualWeightedPage() {
  const [localState, setState] = useState<ISetAllocationsState>(defaultAllocationsPanelState[0])
  const [loading, setLoading] = useState<boolean>(true)
  const [setAllocationsStateStore, setSetAllocationsStateStore] = useState<ISetAllocationsState>()

  const { t } = useTranslation("MarketCapEqualWeightedPage")

  const handleSetAllocationsStateUpdate = useCallback((setAllocationsState:ISetAllocationsState):void => {
    setSetAllocationsStateStore(setAllocationsState)
    new LocalStore({
      key: 'setAllocationsStateId',
      data: [setAllocationsState],
      name: 'setAllocationsState',
    })
  }, [])

  const onUpdate = useCallback((tab: SetAllocationsType, data: ITabPanelData) => {
    setState(prevState => ({
      ...prevState,
      [tab]: data
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack>
      <IndexAllocationsStateStoreContext.Provider value={setAllocationsStateStore}>
        {!loading &&
          <IndexModel
            setAllocationsState={localState}
            tabType={SetAllocationsType.EqualWeight}
            onSetAllocationsStateUpdate={handleSetAllocationsStateUpdate}
            onUpdate={onUpdate}
          />
        }
      </IndexAllocationsStateStoreContext.Provider>
      <IndexModelingSection
        tableAssets={assets}
        title={t("IndexModeling")}
      />
      <HistoricalWalletsWorth
        title={t("ChartTitle")}
        sx={{ textWrap: "nowrap", minWidth: "300px", mt: 4 }}
      />
    </Stack>
  )
}
