import React, { useCallback, useEffect, useState } from 'react'

import { PrefilterTokens } from './prefilter-tokens/prefilter-tokens'
import { SetModeling } from './set-modeling/set-modeling'
import { ITabComponent, ITokenSetAllocation } from './IndexModel.types'
import { ModelSetModelingTableStoreContext } from './ModelLocalStoreContext'
import { HistoricalAnalysis } from './historical-analysis/historical-analysis'

import styles from './IndexModel.module.scss'

export const IndexModel = ({ setAllocationsState, tabType, onSetAllocationsStateUpdate, onUpdate }: ITabComponent) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [prefilteredTokenData, setPrefilteredTokenData] = useState<ITokenSetAllocation[]>([] as ITokenSetAllocation[])
  const [modelSetModelingTableStore, setModelSetModelingTableStore] = useState<ITokenSetAllocation[]>([] as ITokenSetAllocation[])

  const handleUpdateFilteredTokenData = useCallback((filteredTokenData: ITokenSetAllocation[]):void => {
    setPrefilteredTokenData(filteredTokenData)
  }, [])

  const handleModelSetModelingUpdate = useCallback((modelSetModelingTable:ITokenSetAllocation[]):void => {
    if (JSON.stringify(modelSetModelingTableStore) !== JSON.stringify(modelSetModelingTable)) {
      setModelSetModelingTableStore(modelSetModelingTable)
    }
  }, [modelSetModelingTableStore])

  useEffect(() => {
    // Init
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(
    () => {
      // Init
      setLoading(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className={styles.modelTabContainer}>
      <ModelSetModelingTableStoreContext.Provider value={modelSetModelingTableStore}>
        {!loading &&
          <>
          <PrefilterTokens
            tabType={tabType}
            onUpdate={handleUpdateFilteredTokenData} />
          <SetModeling
            prefilteredTokenData={prefilteredTokenData}
            onSetAllocationsStateUpdate={onSetAllocationsStateUpdate}
            onModelSetModelingUpdate={handleModelSetModelingUpdate}
            setAllocationsState={setAllocationsState}
            tabType={tabType}
            onUpdate={onUpdate} />
          <HistoricalAnalysis
            prefilteredTokenData={prefilteredTokenData}
            setAllocationsState={setAllocationsState}
            tabType={tabType} />
          </>
        }
      </ModelSetModelingTableStoreContext.Provider>
    </div>
  )
}
