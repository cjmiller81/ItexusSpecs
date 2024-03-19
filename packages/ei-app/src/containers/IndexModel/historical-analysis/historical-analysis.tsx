import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  Chart,
  Title,
  CommonSeriesSettings,
  Series,
  Legend,
  ArgumentAxis,
  ValueAxis,
  CommonAnnotationSettings,
  Font,
  Export,
  LoadingIndicator,
  Tooltip,
  Format,
  Label,
} from 'devextreme-react/chart'
// eslint-disable-next-line import/no-named-as-default
import ResponsiveBox, { Col, Item, Row, Location } from 'devextreme-react/responsive-box'
import DataSource from 'devextreme/data/data_source'
import CustomStore from 'devextreme/data/custom_store'

import BackendApiService from '@/services/backend-api.service'
import { getDatesInRange, getFirstDaysOfMonthInRange, getFirstDaysOfWeekInRange } from '@/utils/utils'
import { ITokenSetAllocation, SetAllocationsType } from '../IndexModel.types'
import { ModelNames } from '../IndexModel.constants'
import { IChartData, IHistoricalAnalysis } from './historical-analysis.types'
import { calculateWeightValue } from '../set-modeling/model-output-table/model-output-table.utils'
import {
  ModelSetModelingTableStoreContext
} from '../ModelLocalStoreContext'
import { HistoricalAnalysisForm } from './historical-analysis-form/historical-analysis-form'
import { HistoricalAnalysisDateRanges, IHistoricalAnalysisFormState } from './historical-analysis-form/historical-analysis-form.types'
import { IndexAllocationsStateStoreContext } from '../IndexAllocationLocalStoreContext'

import styles from './historical-analysis.module.scss'

export const HistoricalAnalysis: FC<IHistoricalAnalysis> = ({
  prefilteredTokenData,
  setAllocationsState,
  tabType
}) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [setModelingState, setSetModelingState] = useState<ITokenSetAllocation[]>([])
  const [chartData, setChartData] = useState<IChartData[]>([])
  const [chartDataSource, setChartDataSource] = useState<DataSource>()
  const [compareSymbol, setCompareSymbol] = useState<string>("")
  const chartRef = useRef<Chart>(null)

  const setAllocationsStateStore = useContext(IndexAllocationsStateStoreContext)
  const modelSetModelingTableStore = useContext(ModelSetModelingTableStoreContext)

  useEffect(() => {
    if (chartData) {
      setChartDataSource(new DataSource({
        store: new CustomStore({
          // eslint-disable-next-line no-unused-vars
          load: (_loadOptions) => {
            return new Promise(r => r(chartData))
          },
          loadMode: 'raw',
        }),
        paginate: false,
      }))
    }
  }, [chartData])

  const getData = useCallback(async ():Promise<void> => {
    if (setAllocationsStateStore && prefilteredTokenData && prefilteredTokenData.length > 0) {
      let startPrice:number = 0

      const setModelingData:ITokenSetAllocation[] = modelSetModelingTableStore

      if (setAllocationsStateStore) {
        if (setAllocationsStateStore[tabType].setModeling.startPrice) {
          startPrice = setAllocationsStateStore[tabType].setModeling.startPrice
        }
      }

      const newData = setModelingData.map((item) => ({
        ...item,
        qty: Number(((calculateWeightValue(tabType, item.marketCap, prefilteredTokenData) * startPrice) / item.price).toFixed(6))
      }))
      setSetModelingState(newData)
    }
  }, [modelSetModelingTableStore, prefilteredTokenData, setAllocationsStateStore, tabType])

  useEffect(() => {
    // Init
    void getData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    void getData()
  }, [setAllocationsState, prefilteredTokenData, setAllocationsStateStore, modelSetModelingTableStore, getData])

  const getHistoryDates = useCallback((startDate: Date, endDate: Date, period: HistoricalAnalysisDateRanges):Date[] => {
    let dates: Date[] = []
    try {
      switch(period) {
        case HistoricalAnalysisDateRanges.Daily:
          dates = getDatesInRange(startDate, endDate)
          break
        case HistoricalAnalysisDateRanges.Weekly:
          dates = getFirstDaysOfWeekInRange(startDate, endDate)
          break
        case HistoricalAnalysisDateRanges.Monthly:
          dates = getFirstDaysOfMonthInRange(startDate, endDate)
          break
      }

      if (dates.length === 0) {
        dates.push(startDate)
      }
    } catch (err) {
      console.error('Error on getHistoryDates:', err)
    }

    return dates
  }, [])

  // eslint-disable-next-line no-unused-vars
  const _loadData = useCallback(async (startDate: Date, endDate: Date, period: HistoricalAnalysisDateRanges, compareSymbolId: string):Promise<void> => {
    try {
      const localChartData:IChartData[] = []
      let localStartPriceValue:number = 0
      let localStartPriceCompareValue:number = 0
      let firstLoop:boolean = true
      const dates = getHistoryDates(startDate, endDate, period)

      for (let i = 0; i < dates.length; i++) {
        let closePriceValue = 0
        let closePriceCompareValue = 0
        const chartDataPoint:IChartData = {
          date: dates[i].toISOString().slice(0, 10),
          close: 0,
          compareClose: 0,
        }

        for (let j = 0; j < setModelingState.length; j++) {
          let priceHistory = await BackendApiService.getTokenPriceHistory(setModelingState[j].id, dates[i])
          if (priceHistory && priceHistory.market_data && priceHistory.market_data.current_price && priceHistory.market_data.current_price.usd) {
            closePriceValue = closePriceValue + (priceHistory.market_data.current_price.usd * (setModelingState[j].qty ?? 1))

            if (firstLoop) {
              localStartPriceValue = closePriceValue
            }
          }
        }

        if (localStartPriceValue !== 0) {
          chartDataPoint.close = ((closePriceValue - localStartPriceValue) / localStartPriceValue)
        }

        if (compareSymbolId != "") {
          let priceHistoryCompare = await BackendApiService.getTokenPriceHistory(compareSymbolId, dates[i])
          if (priceHistoryCompare && priceHistoryCompare.market_data && priceHistoryCompare.market_data.current_price && priceHistoryCompare.market_data.current_price.usd) {
            closePriceCompareValue = closePriceCompareValue + (priceHistoryCompare.market_data.current_price.usd)

            if (firstLoop) {
              localStartPriceCompareValue = closePriceCompareValue
              setCompareSymbol(priceHistoryCompare.symbol.toUpperCase())
            }
          }

          if (localStartPriceCompareValue !== 0) {
            chartDataPoint.compareClose = ((closePriceCompareValue - localStartPriceCompareValue) / localStartPriceCompareValue)
          }
        } else {
          setCompareSymbol("")
        }

        firstLoop = false

        localChartData.push(chartDataPoint)
      }

      setChartData(localChartData)
      await chartDataSource?.load()
    } catch (err) {
      console.error('Error on loadData:', err)
    }
  }, [chartDataSource, getHistoryDates, setModelingState])

  const loadModelIndexPercentChangeData = useCallback(async (startDate: Date, endDate: Date, period: HistoricalAnalysisDateRanges, compareSymbolId: string):Promise<void> => {
    try {
      const localChartData:IChartData[] = []
      let localStartPriceValue:number = 0
      let localStartPriceCompareValue:number = 0
      let firstLoop:boolean = true
      const dates = getHistoryDates(startDate, endDate, period)

      let indexHistory = await BackendApiService.getMarketCapWeightedIndexHistory(setAllocationsState[tabType].setModeling.tokenCount, startDate, endDate, compareSymbolId)

      for (let i = 0; i < indexHistory.length; i++) {
        const isPeriodDate = dates.find(date => date.toISOString().split('T')[0] == indexHistory[i].capWeightedDate.toString())
        console.log('isPeriodDate Data:', isPeriodDate)
        if (isPeriodDate) {
          let closePriceValue = 0
          let closePriceCompareValue = 0
          console.log('indexHistory Data:', indexHistory[i])
          const chartDataPoint:IChartData = {
            date: indexHistory[i].capWeightedDate.toString(),
            close: 0,
            compareClose: 0,
          }

          closePriceValue = closePriceValue + (tabType == SetAllocationsType.EqualWeight ? indexHistory[i].capEqualWeightedIndex : indexHistory[i].capWeightedIndex)
          if (firstLoop) {
            localStartPriceValue = closePriceValue
          }
          console.log("closePriceValue", closePriceValue)
          console.log("localStartPriceValue", localStartPriceValue)

          if (localStartPriceValue !== 0) {
            chartDataPoint.close = ((closePriceValue - localStartPriceValue) / localStartPriceValue)
          }

          if (compareSymbolId != "") {
            closePriceCompareValue = closePriceCompareValue + (indexHistory[i].comparePrice ?? 0)

            if (firstLoop) {
              localStartPriceCompareValue = closePriceCompareValue
              setCompareSymbol(compareSymbolId)
            }

            console.log("closePriceCompareValue", closePriceCompareValue)
            console.log("localStartPriceCompareValue", localStartPriceCompareValue)
            if (localStartPriceCompareValue !== 0) {
              chartDataPoint.compareClose = ((closePriceCompareValue - localStartPriceCompareValue) / localStartPriceCompareValue)
            }
          } else {
            setCompareSymbol("")
          }

          localChartData.push(chartDataPoint)

          firstLoop = false
        }
      }

      setChartData(localChartData)
      await chartDataSource?.load()
    } catch (err) {
      console.error('Error on loadModelIndexPercentChangeData:', err)
    }
  }, [chartDataSource, getHistoryDates, setAllocationsState, tabType])

  // eslint-disable-next-line no-unused-vars
  const _loadModelIndexData = useCallback(async (startDate: Date, endDate: Date, period: HistoricalAnalysisDateRanges, compareSymbolId: string):Promise<void> => {
    try {
      const localChartData:IChartData[] = []
      const dates = getHistoryDates(startDate, endDate, period)

      let indexHistory = await BackendApiService.getMarketCapWeightedIndexHistory(setAllocationsState[tabType].setModeling.tokenCount, startDate, endDate, compareSymbolId)

      for (let i = 0; i < indexHistory.length; i++) {
        const isPeriodDate = dates.find(date => date.toISOString().split('T')[0] == indexHistory[i].capWeightedDate.toString())
        if (isPeriodDate) {
          console.log('indexHistory Data:', indexHistory[i])
          const chartDataPoint:IChartData = {
            date: indexHistory[i].capWeightedDate.toString(),
            close: 0,
            compareClose: 0,
          }

          chartDataPoint.close = tabType == SetAllocationsType.EqualWeight ? indexHistory[i].capEqualWeightedIndex : indexHistory[i].capWeightedIndex

          if (compareSymbolId != "") {
            if (indexHistory[i].comparePrice) {
              setCompareSymbol(compareSymbolId)
            }

            chartDataPoint.compareClose = indexHistory[i].comparePrice
          } else {
            setCompareSymbol("")
          }

          localChartData.push(chartDataPoint)
        }
      }

      setChartData(localChartData)
      await chartDataSource?.load()
    } catch (err) {
      console.error('Error on loadModelIndexData:', err)
    }
  }, [chartDataSource, getHistoryDates, setAllocationsState, tabType])

  const onSubmit = useCallback(async (formState: IHistoricalAnalysisFormState):Promise<void> => {
    try {
      let [startDate, endDate] = formState.dateRange.value as Date[]

      setLoading(true)
      //await loadData(startDate, endDate, formState.period, formState.compareSymbolId)
      await loadModelIndexPercentChangeData(startDate, endDate, formState.period, formState.compareSymbolId)
      setLoading(false)
    } catch(e) {
      console.error(e)
    }
  }, [loadModelIndexPercentChangeData])

  const screenByWidth = useCallback((width: number): string => {
    try {
      chartRef?.current?.instance?.refresh()
    } catch(e) {
      console.error(e)
    }

    return (width < 1100) ? 'sm' : 'lg'
  }, [])

  return (
    <div className={styles.historicalAnalysisContainer}>
      <ResponsiveBox
        singleColumnScreen="sm"
        screenByWidth={screenByWidth}>
        <Row ratio={1}></Row>
        <Row ratio={1}></Row>

        <Col ratio={1}></Col>
        <Col ratio={1} screen="lg"></Col>
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
          <HistoricalAnalysisForm isLoading={isLoading} onSubmit={onSubmit} />
        </Item>
        <Item>
          <Location
            row={1}
            col={0}
            colspan={2}
            screen="lg"
          ></Location>
          <Location
            row={1}
            col={0}
            screen="sm"
          ></Location>
          <Chart
            id="chart"
            dataSource={chartDataSource}
            ref={chartRef}
          >
            <Title text={`${ModelNames[tabType]} Index`} />
            <CommonSeriesSettings argumentField="date" type="line" />
            <Series valueField="close" name="Index" axis="index" />
            { (compareSymbol != "" ? <Series valueField="compareClose" name={compareSymbol} axis="index" /> : <></>)}
            <ArgumentAxis argumentType="datetime" />
            <Legend
              verticalAlignment="bottom"
              horizontalAlignment="center"
              itemTextPosition="bottom"
            />
            <ValueAxis name="index" position="right" title="Percent Change">
              <Label>
                <Format
                  type="percent"
                  precision={4}
                />
              </Label>
            </ValueAxis>
            <Export enabled={true} />
            <LoadingIndicator enabled={true} />
            <Tooltip enabled={true}>
              <Format
                type="percent"
                precision={4}
              />
            </Tooltip>
            <CommonAnnotationSettings series="Index" type="image">
              <Font size={16} weight={600} />
            </CommonAnnotationSettings>
          </Chart>
        </Item>
      </ResponsiveBox>
    </div>
  )
}
