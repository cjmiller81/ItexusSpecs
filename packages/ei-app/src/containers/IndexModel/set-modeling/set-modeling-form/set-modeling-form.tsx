import React, { useState, FC, useEffect, useContext, useCallback } from 'react'
import {
    Form,
    SimpleItem
} from 'devextreme-react/form'
import ResponsiveBoxDef, { Col, Item, Row, Location } from 'devextreme-react/responsive-box'

import { ModelOutputTable } from '../model-output-table/model-output-table'
import { ISetModelingForm } from './set-modeling-form.types'
import { SetModelingFormField, SetModelingFormLabel } from './set-modeling-form.constants'
import { ISetAllocationsState } from '../../IndexModel.types'
import { IndexAllocationsStateStoreContext } from '../../IndexAllocationLocalStoreContext'

import styles from './set-modeling-form.module.scss'

export const SetModelingForm: FC<ISetModelingForm> = ({ prefilteredTokenData, tabType, onSetAllocationsStateUpdate, onModelSetModelingUpdate, onUpdate }) => {
  const [tokenCount, setTokenCount] = useState<number>(33)
  const [startPrice, setStartPrice] = useState<number>(100)
  const [equalWeight, setEqualWeight] = useState<number>(1 / 33)
  const [loading, setLoading] = useState<boolean>(true)

  const setAllocationsStateStore = useContext(IndexAllocationsStateStoreContext) as ISetAllocationsState

  const weightOptions = {
    showClearButton: false,
    showSpinButtons: false,
    format: "#0.00%" ,
    value: equalWeight,
    disabled: true,
  }

  const tokenOptions = {
    showClearButton: false,
    showSpinButtons: true,
    value: tokenCount,
    min: 1,
  }

  const startPriceOptions = {
    showClearButton: false,
    showSpinButtons: true,
    value: startPrice,
    min: 10,
    step: 10,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formFieldDataChanged = (e: { dataField?: any; value?: string|number }): void => {
    if (!loading) {
      const updatedField = e.dataField ?? ''
      let newValue
      if (updatedField == SetModelingFormField.TokenCount) {
        newValue = Number(e.value) ?? 0
        setAllocationsStateStore[tabType].setModeling.tokenCount = newValue
        setTokenCount(newValue)
        setEqualWeight(1 / newValue)
      }
      if (updatedField == SetModelingFormField.StartPrice) {
        newValue = Number(e.value) ?? 0
        setAllocationsStateStore[tabType].setModeling.startPrice = newValue
        setStartPrice(newValue)
      }
      /*
      if (updatedField == SetModelingFormField.EqualWeight) {
        newValue = Number(e.value) ?? 0
        setAllocationsStateStore[tabType].setModeling.equalWeight = newValue
        setEqualWeight(newValue)
      }
      */
      onUpdate(updatedField, newValue)
      onSetAllocationsStateUpdate(setAllocationsStateStore)
    }
  }

  const screenByWidth = useCallback((width: number): string => {
    return (width < 1300) ? 'sm' : 'lg'
  }, [])

  useEffect(() => {
    if (setAllocationsStateStore) {
      if (setAllocationsStateStore[tabType].setModeling != null) {
        setStartPrice(setAllocationsStateStore[tabType].setModeling.startPrice)
        setTokenCount(setAllocationsStateStore[tabType].setModeling.tokenCount)
        setEqualWeight(1 / setAllocationsStateStore[tabType].setModeling.tokenCount)
      }
    }

    setLoading(false)
  }, [setAllocationsStateStore, tabType])

  return (
    <div className={styles.setModelingContainer}>
      <ResponsiveBoxDef
        singleColumnScreen="sm"
        screenByWidth={screenByWidth}>
        <Row ratio={1}></Row>
        <Row ratio={2} screen="sm"></Row>

        <Col ratio={1}></Col>
        <Col ratio={3} screen="lg"></Col>
        <Item>
          <Location
            row={0}
            col={0}
            screen="lg"
          ></Location>
          <Location
            row={0}
            col={0}
            screen="sm"
          ></Location>
          <div className={styles.setModelingFormContainer}>
            <Form className={styles.setModelingForm} onFieldDataChanged={formFieldDataChanged}>
              <SimpleItem
                dataField={SetModelingFormField.TokenCount}
                editorType="dxNumberBox"
                editorOptions={tokenOptions}
                label={{text: SetModelingFormLabel.TokenCount }}
              />
              {
                tabType !== 'equalWeight'
                  ? <></>
                  :  <SimpleItem
                        dataField={SetModelingFormField.EqualWeight}
                        editorType="dxNumberBox"
                        editorOptions={weightOptions}
                        label={{text: SetModelingFormLabel.EqualWeight }}
                      />
              }
              <SimpleItem
                dataField={SetModelingFormField.StartPrice}
                editorType="dxNumberBox"
                editorOptions={startPriceOptions}
                label={{text: SetModelingFormLabel.StartPrice }}
              />
            </Form>
          </div>
        </Item>
        <Item>
          <Location
            row={0}
            col={1}
            screen="lg"
          ></Location>
          <Location
            row={1}
            col={0}
            screen="sm"
          ></Location>
          <ModelOutputTable
            prefilteredTokenData={prefilteredTokenData}
            tabType={tabType}
            onModelSetModelingUpdate={onModelSetModelingUpdate}
            tokenCount={tokenCount}
            startPrice={startPrice} />
        </Item>
      </ResponsiveBoxDef>
    </div>
  )
}
