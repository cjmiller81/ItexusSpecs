import React, { FC } from 'react'

import { SetModelingForm } from './set-modeling-form/set-modeling-form'
import { ISetModeling } from './set-modeling.types'
import { ModelCard } from '../IndexModel.constants'

import styles from './set-modeling.module.scss'

export const SetModeling: FC<ISetModeling> = ({
   prefilteredTokenData,
   onSetAllocationsStateUpdate,
   onModelSetModelingUpdate,
   onUpdate,
   setAllocationsState,
   tabType
}) => {
  const onUpdateData = (dataField: string, value: any): void => {
    const setModelingState = {
      ...setAllocationsState[tabType].setModeling,
      [dataField]: value,
    }
    const modelState = {
      ...setAllocationsState[tabType],
      [ModelCard.SetModeling]: setModelingState
    }
    onUpdate(tabType, modelState)
  }

  return (
    <div className={styles.setModelingContainer}>
      <SetModelingForm
        prefilteredTokenData={prefilteredTokenData}
        tabType={tabType}
        onSetAllocationsStateUpdate={onSetAllocationsStateUpdate}
        onModelSetModelingUpdate={onModelSetModelingUpdate}
        onUpdate={onUpdateData} />
    </div>
  )
}
