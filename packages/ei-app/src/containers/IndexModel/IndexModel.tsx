import { useCallback, useState } from "react"

import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import styles from "./IndexModel.module.scss"
import { ITabComponent, ITokenSetAllocation } from "./IndexModel.types"
import { ModelSetModelingTableStoreContext } from "./ModelLocalStoreContext"
import { HistoricalAnalysis } from "./historical-analysis/historical-analysis"
import { SetModeling } from "./set-modeling/set-modeling"

export const IndexModel = ({ setAllocationsState, tabType, onSetAllocationsStateUpdate, onUpdate }: ITabComponent) => {
  const { prefilteredData } = useAppSelector(appStore => appStore.walletsReducer.MarketCapEqualWeightModeling)

  const [modelSetModelingTableStore, setModelSetModelingTableStore] = useState<ITokenSetAllocation[]>(
    [] as ITokenSetAllocation[],
  )

  const handleModelSetModelingUpdate = useCallback(
    (modelSetModelingTable: ITokenSetAllocation[]): void => {
      if (JSON.stringify(modelSetModelingTableStore) !== JSON.stringify(modelSetModelingTable)) {
        setModelSetModelingTableStore(modelSetModelingTable)
      }
    },
    [modelSetModelingTableStore],
  )

  return (
    
      <ModelSetModelingTableStoreContext.Provider value={modelSetModelingTableStore}>
        <>
          <SetModeling
            prefilteredTokenData={prefilteredData}
            onSetAllocationsStateUpdate={onSetAllocationsStateUpdate}
            onModelSetModelingUpdate={handleModelSetModelingUpdate}
            setAllocationsState={setAllocationsState}
            tabType={tabType}
            onUpdate={onUpdate}
          />
          <HistoricalAnalysis
            prefilteredTokenData={prefilteredData}
            setAllocationsState={setAllocationsState}
            tabType={tabType}
          />
        </>
      </ModelSetModelingTableStoreContext.Provider>
  )
}
