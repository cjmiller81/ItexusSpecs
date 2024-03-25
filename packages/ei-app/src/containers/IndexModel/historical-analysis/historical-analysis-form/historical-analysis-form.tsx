import React, { FC, useCallback, useMemo, useState } from 'react'
import { DateRangeBox } from 'devextreme-react/date-range-box'
import { ValueChangedEvent as DateRangeBoxValueChangedEvent } from 'devextreme/ui/date_range_box_types'
import { ValueChangedEvent as LookupValueChangedEvent } from 'devextreme/ui/lookup'
import {
  ButtonItem,
  Item,
  Label,
  RangeRule,
  RequiredRule,
  SimpleItem
} from 'devextreme-react/form'
import { ClickEvent, Properties } from 'devextreme/ui/button'
import { Form, Validator } from 'devextreme-react'
import { FieldDataChangedEvent } from 'devextreme/ui/form'

import { SymbolLookup, SymbolLookupField, SymbolLookupListItem } from '@/components/common/inputs/symbol-lookup/symbol-lookup'
import { BackendApiService } from '@/services/backend-api.service'
import {
  HistoricalAnalysisDateRanges,
  IDateRange,
  IHistoricalAnalysisForm,
  IHistoricalAnalysisFormState
} from './historical-analysis-form.types'

import styles from './historical-analysis-form.module.scss'

enum HistoricalAnalysisFormField {
  DateRange = 'dateRange',
  Period = 'period',
  CompareSymbolId = 'compareSymbolId',
}

enum HistoricalAnalysisFormLabel {
  DateRange = 'Date Range',
  Period = 'Period',
  CompareSymbolId = 'Compare to Symbol',
}

const msInDay = 1000 * 60 * 60 * 24
const now = new Date()
const maxDate = new Date().setDate(now.getDate()) // The current date.
const minDate = new Date('2013-04-28') // Start of Coingecko's history data for BTC is April 28th, 2013.

const defaultHistoricalAnalysisFormState:IHistoricalAnalysisFormState = {
  dateRange: {
    value: [
      new Date(now.getTime() - (msInDay * 3)),
      new Date(new Date().setDate(now.getDate())),
    ]
  },
  period: HistoricalAnalysisDateRanges.Daily,
  compareSymbolId: 'bitcoin',
}

const symbolLookupRenderField = (fieldData: {
  lURI: string | undefined
  sym: string
  name: string
  id: string
}): React.ReactNode => {
  return (
    <SymbolLookupField
      Description={fieldData?.name ?? ""}
      IconUrl={fieldData?.lURI ?? ""}
      Symbol={fieldData?.sym}
    />
  )
}

const symbolLookupRenderListItem = (itemData: {
  lURI: string | undefined
  sym: string
  name: string
  id: string
}): React.ReactNode => {
  return (
    <SymbolLookupListItem
      Category=""
      Description={itemData?.name ?? ""}
      IconUrl={itemData?.lURI ?? ""}
      Symbol={itemData?.sym}
    />
  )
}

export const HistoricalAnalysisForm: FC<IHistoricalAnalysisForm> = ({
  isLoading,
  onSubmit
}) => {
  const convertRangeToDays = useCallback(([startDate, endDate]:Date[]):number => {
    const diffInDay = Math.floor(Math.abs((endDate.getTime() - startDate.getTime()) / msInDay))

    return diffInDay + 1
  }, [])

  const [formState, setFormState] = useState(defaultHistoricalAnalysisFormState)
  const [selectedDays, setSelectedDays] = useState(convertRangeToDays(defaultHistoricalAnalysisFormState.dateRange.value))

  const periodEditorOptions = {
    items: Object.values(HistoricalAnalysisDateRanges),
    searchEnabled: true,
    value: defaultHistoricalAnalysisFormState.period
  }

  // eslint-disable-next-line no-unused-vars
  const onButtonClick = useCallback((_e: ClickEvent): void => {
    onSubmit(formState)
  }, [formState, onSubmit])

  const buttonOptions: Properties = useMemo(() => {
    return {
      activeStateEnabled: true,
      disabled: isLoading,
      onClick: onButtonClick,
      stylingMode: 'contained',
      text: isLoading ? 'Running...' : 'Run Test',
      type: 'success',
      useSubmitBehavior: false,
    }
  }, [isLoading, onButtonClick])

  const onCurrentDateRangeValueChange = useCallback((e: DateRangeBoxValueChangedEvent) => {
    if (!isLoading) {
      let daysCount = 0
      let [startDate, endDate] = e.value as Date[]
      let newValue = formState

      if (startDate && endDate) {
        daysCount = convertRangeToDays([startDate, endDate])
        newValue.dateRange.value = [startDate, endDate] ?? defaultHistoricalAnalysisFormState.dateRange.value

        setFormState(newValue)
      }

      setSelectedDays(daysCount)
    }
  }, [convertRangeToDays, formState, isLoading])

  const onSymbolLookupValueChange = useCallback((e: LookupValueChangedEvent) => {
    if (!isLoading) {
      let symbolId = e.value as string
      let newValue = formState

      newValue.compareSymbolId = symbolId
      setFormState(newValue)
    }
  }, [formState, isLoading])

  const formFieldDataChanged = useCallback((e: FieldDataChangedEvent) => {
    if (!isLoading) {
      const updatedField = e.dataField ?? ''
      let newValue = formState

      // TODO: This isn't used yet until the `Form` component does not yet (2023-06-28) support a `editorType="dxDateRangeBox"`
      if (updatedField == HistoricalAnalysisFormField.DateRange) {
        newValue.dateRange = e.value as IDateRange ?? defaultHistoricalAnalysisFormState.dateRange

        setFormState(newValue)
      }
      if (updatedField == HistoricalAnalysisFormField.Period) {
        newValue.period = String(e.value) as HistoricalAnalysisDateRanges ?? defaultHistoricalAnalysisFormState.period

        setFormState(newValue)
      }
    }
  }, [formState, isLoading])

  return (
    <div className={styles.historicalAnalysisFormContainer}>
      <Form
        className={styles.historicalAnalysisForm}
        formData={formState}
        onFieldDataChanged={formFieldDataChanged}
        readOnly={false}
      >
        <Item
          dataField={HistoricalAnalysisFormField.Period}
          editorType="dxSelectBox"
          editorOptions={periodEditorOptions}
          label={{text: HistoricalAnalysisFormLabel.Period }}>
        </Item>
        <SimpleItem>
          <Label text={HistoricalAnalysisFormLabel.DateRange} />
          {/* TODO:
            * The `Form` component does not yet (2023-06-28) support a `editorType="dxDateRangeBox"` so we make a custom SimpleItem..
            * @see: https://github.com/DevExpress/DevExtreme/blob/c2685f31230b88414ec37f81373b2e74d24c272c/js/ui/form.d.ts#L60
            */}
          <DateRangeBox
            defaultValue={formState.dateRange.value}
            max={maxDate}
            min={minDate}
            onValueChanged={onCurrentDateRangeValueChange}>
            <Validator>
              <RequiredRule message="Date Range is required" />
              <RangeRule
                  max={maxDate}
                  min={minDate}
                  message="You must select a date between Jan 1st 2014 and today."
              />
            </Validator>
          </DateRangeBox>
          <div className="selected-days-wrapper ">
            <span>Days selected: </span>
            <span>{ selectedDays }</span>
          </div>
        </SimpleItem>
        <SimpleItem>
          <Label text={HistoricalAnalysisFormLabel.CompareSymbolId} />
          <SymbolLookup
            DataSource={BackendApiService.SymbolLookupDataSource}
            DataSourceKey={"id"}
            FieldRender={symbolLookupRenderField}
            ItemRender={symbolLookupRenderListItem}
            defaultValue={formState.compareSymbolId}
            onValueChanged={onSymbolLookupValueChange}
          />
        </SimpleItem>
        <ButtonItem
          horizontalAlignment="left"
          buttonOptions={buttonOptions}
        />
      </Form>
    </div>
  )
}
