/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DataSource, { DataSourceOptions } from 'devextreme/data/data_source'
import { DataType } from 'devextreme/common'
import DataGridDef, {
  Column,
  ColumnChooser,
  Export,
  FilterBuilderPopup,
  FilterPanel,
  FilterRow,
  HeaderFilter,
  LoadPanel,
  Pager,
  Paging,
  Search,
} from 'devextreme-react/data-grid'
import { Workbook } from 'exceljs'
import LocalStore from 'devextreme/data/local_store'
import { exportDataGrid } from 'devextreme/excel_exporter'
import { saveAs } from 'file-saver-es'
import { PositionConfig } from 'devextreme/animation/position'
import { dxPopupToolbarItem } from 'devextreme/ui/popup'
import { EventInfo } from 'devextreme/events'

import { IPrefilterTokensDataRow, IPrefilterTokensTable } from './prefilter-tokens-table.types'
import { PrefilterTokensField, PrefilterTokensLabel } from './prefilter-tokens-table.constants'
import CustomFilterBuilder from '../custom-filter-builder/custom-filter-builder'
import { useBackendApi } from '../../backend-api-hook'
import { ITokenSetAllocation } from '../../IndexModel.types'
import BackendApiServiceInstance, { ICategory, IPlatform, IPrefilterTokensFilterValues } from '@/services/backend-api.service'
import { SymbolCellIdComponent } from '@/components/common/inputs/symbol-lookup/symbol-lookup'

export const PrefilterTokensTable: FC<IPrefilterTokensTable> = ({ tabType, onUpdate }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isDataLoading, setDataLoading] = useState<boolean>(false)
  const [hasDataLoaded, setHasDataLoaded] = useState<boolean>(false)
  const [categories, setCategories] = useState<string[]>()
  const [chains, setChains] = useState<string[]>()
  const [hasFilterToAppply, setHasFilterToAppply] = useState<boolean>(false)
  const [filterToAppply, setFilterToAppply] = useState<string | Function | any[] | undefined>(undefined)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datagrid = React.createRef<DataGridDef<IPrefilterTokensDataRow, any>>()
  const filterBuilderPopupRef = React.createRef<FilterBuilderPopup>()
  const allowedPageSizes = [5, 10, 20, 50]
  const store = useMemo(
    () =>
      new LocalStore({
        key: 'id',
        immediate: true,
        name: 'prefilterTokensTable',
      }),
    []
  )

  const dataSource = useMemo(
    () =>
      new DataSource({
        store: store,
      }),
    [store]
  )

  const filterBuilderPopupPosition: PositionConfig = {
    of: global?.window !== undefined ? window : undefined,
    at: 'top',
    my: 'top',
    offset: { y: 10 },
  }

  const filterBuilder = {
    customOperations: [],
    allowHierarchicalFields: true,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterValueRef = useRef([])

  const { fetchData } = useBackendApi()

  const updatePrefilteredTokens = useCallback(async (): Promise<void> => {
    try {
      const grid = datagrid?.current?.instance

      if (isDataLoading && grid && dataSource) {
        const combinedFilterExpr = grid.getCombinedFilter(true)
        const filterExpr = grid.filter()
        const filteredDataSource = grid.getDataSource()
        const loadOptions = dataSource.loadOptions()

        if (hasDataLoaded) {
          datagrid?.current?.instance?.filter(filterExpr ?? combinedFilterExpr)
          await grid.refresh()

          const prefilteredTokenData = [] as ITokenSetAllocation[]

          const foo = filteredDataSource.items() as IPrefilterTokensDataRow[]
          foo.forEach((row) => {
            const prefilteredTokenRow = {} as ITokenSetAllocation
            prefilteredTokenRow.id = row.id
            prefilteredTokenRow.symbol = row.sym.toUpperCase()
            prefilteredTokenRow.price = row.price
            prefilteredTokenRow.marketCap = row.mCap

            prefilteredTokenData.push(prefilteredTokenRow)
          })

          onUpdate(prefilteredTokenData)
        } else {
          await filteredDataSource
            .store()
            .load({ filter: filterExpr ?? combinedFilterExpr, sort: loadOptions.sort, group: loadOptions.group })
            .then((result) => {
              setHasDataLoaded(true)
              const prefilteredTokenData = [] as ITokenSetAllocation[]

              const foo = result as IPrefilterTokensDataRow[]
              foo.forEach((row) => {
                const prefilteredTokenRow = {} as ITokenSetAllocation
                prefilteredTokenRow.id = row.id
                prefilteredTokenRow.symbol = row.sym.toUpperCase()
                prefilteredTokenRow.price = row.price
                prefilteredTokenRow.marketCap = row.mCap

                prefilteredTokenData.push(prefilteredTokenRow)
              })
              onUpdate(prefilteredTokenData)
            })
            .catch((err) => {
              console.error('Error on updatePrefilteredTokens filteredDataSource:', err)
            })
        }

        setDataLoading(false)
      }
    } catch (err) {
      console.error('Error on updatePrefilteredTokens:', err)
    }
  }, [datagrid, isDataLoading, dataSource, hasDataLoaded, onUpdate])

  const loadData = useCallback(async () => {
    try {
      const coinGeckoCategories = global?.window !== undefined ? localStorage.getItem('coinGeckoCategories') : null
      if (coinGeckoCategories !== null && dataSource) {
        const categoryList: string[] = []
        const categoryData: ICategory[] = JSON.parse(coinGeckoCategories)
        categoryData.forEach((cat) => {
          categoryList.push(cat.name)
        })
        categoryList.sort()
        setCategories(categoryList)
        setDataLoading(true)
      }

      const coinGeckoChains = global?.window !== undefined ? localStorage.getItem('coinGeckoChains') : null
      if (coinGeckoChains !== null && dataSource) {
        const chainsList: string[] = []
        const chainsData: IPlatform[] = JSON.parse(coinGeckoChains)
        chainsData.forEach((chain) => {
          if (chain.id.length > 0) {
            chainsList.push(chain.id)
          }
        })
        chainsList.sort()
        setChains(chainsList)
        setDataLoading(true)
      }

      // TODO: this doesn't so data on initial load...
      datagrid?.current?.instance?.filter(filterValueRef.current)
      await datagrid?.current?.instance?.refresh()

      setLoading(false)
    } catch (err) {
      console.error('Error on loadData:', err)
    }
  }, [dataSource, datagrid])

  const refreshData = async (): Promise<void> => {
    try {
      await fetchData()
      await loadData()
    } catch (e) {
      console.error(e)
    }
  }

  const categoryToFilterItem = (item: string): { text: string; value: string } => {
    return {
      text: item,
      value: item,
    }
  }

  const categoriesFilterOperations = ['contains', 'anyof', 'endswith', '=', 'startswith']
  const categoriesHeaderFilter = {
    dataSource: {
      store: {
        type: 'array',
        data: categories,
      },
      map: categoryToFilterItem,
    },
  }

  const chainsToFilterItem = (item: string): { text: string; value: string } => {
    return {
      text: item,
      value: item,
    }
  }
  const chainsHeaderFilter = {
    dataSource: {
      store: {
        type: 'array',
        data: chains,
      },
      map: chainsToFilterItem,
    },
  }

  const [predefinedFilters, setPredefinedFilters] = useState<IPrefilterTokensFilterValues[]>([] as IPrefilterTokensFilterValues[])

  const calculateFilterExpression = useCallback(function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterValues: any,
    selectedFilterOperation: string | null,
    _target: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    try {
      let column = this
      if (filterValues) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let selector = (data: any): boolean => {
          let applyOperation = (arg1: string, arg2: string, op: string): boolean => {
            if (op === '=') return arg1.toUpperCase() === arg2.toUpperCase()
            if (op === 'anyof') return arg1.toUpperCase().includes(arg2.toUpperCase())
            if (op === 'contains') return arg1.toUpperCase().includes(arg2.toUpperCase())
            if (op === 'startswith') return arg1.toUpperCase().startsWith(arg2.toUpperCase())
            if (op === 'endswith') return arg1.toUpperCase().endsWith(arg2.toUpperCase())

            return false
          }

          let values = column.calculateCellValue(data)
          return (
            values &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !!values.find((v: any) => applyOperation(v, filterValues, selectedFilterOperation ?? ''))
          )
        }

        return [selector, '=', true]
      }

      return column.defaultCalculateFilterExpression.apply(this, arguments)
    } catch (err) {
      console.error('Error on calculateFilterExpression:', err)
    }
  }, [])

  const onFilterValueChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (value: any): Promise<void> => {
      try {
        const grid = datagrid?.current?.instance
        grid?.clearFilter()
        const fromFilterBuilder = !Array.isArray(value) && value?.value
        filterValueRef.current = fromFilterBuilder ? value.value : value

        if (global?.window !== undefined) {
          if (filterValueRef && filterValueRef.current) {
            localStorage.setItem(`${tabType}PrefilterTokensFilterValues`, JSON.stringify(filterValueRef.current))
          } else {
            localStorage.setItem(`${tabType}PrefilterTokensFilterValues`, JSON.stringify([]))
          }
        }

        setDataLoading(true)
        await updatePrefilteredTokens()
      } catch (err) {
        console.error('Error on onFilterValueChange:', err)
      }
    },
    [datagrid, tabType, updatePrefilteredTokens]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onExporting = useCallback(
    async (e: any): Promise<void> => {
      const workbook = new Workbook()
      const worksheet = workbook.addWorksheet('Main sheet')

      const currentDate = new Date()

      await exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(async () => {
        await workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            `TokenSets-Model-Prefilter-Tokens-${currentDate.toISOString().split('T')[0]}.xlsx`
          )
        })
      })
      e.cancel = true
    },
    []
  )

  const loadFilterValues = useCallback(async (): Promise<void> => {
    let filterValues = await BackendApiServiceInstance.getTokensFilters()
    setPredefinedFilters(filterValues)
  }, [])

  useEffect(() => {
    const filterValueJson = global?.window !== undefined ? localStorage.getItem(`${tabType}PrefilterTokensFilterValues`) : undefined

    if (filterValueJson && filterValueJson?.length > 0) {
      filterValueRef.current = JSON.parse(filterValueJson)
    } else {
      filterValueRef.current = []
    }
    void loadFilterValues()
    void refreshData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filterBuilderActions = [
    {
      toolbar: 'bottom',
      // widget: 'dxButton',
      options: {
        text: 'Apply',
      },
    },
  ] as dxPopupToolbarItem[]

  const handleApplyFilter = useCallback(
    async () => {
      try {
        if (hasFilterToAppply) {
          if (dataSource && dataSource.isLoaded()) {
            // Update the data source with the new filter conditions and refresh the DataGrid.
            await onFilterValueChange(filterToAppply)
          }

          setHasFilterToAppply(false)
          setFilterToAppply(undefined)
        }
      } catch (error) {
        console.error('Error applying filter:', error)
      }
    },
    [dataSource, filterToAppply, hasFilterToAppply, onFilterValueChange]
  )

  const handleOnDisposing = useCallback(
    async (_e: EventInfo<any>): Promise<void> => {
      await handleApplyFilter()
    },
    [handleApplyFilter]
  )

  const handleApplyFilterCache = useCallback(
    (filter: string | Function | any[] | undefined) => {
      setHasFilterToAppply(true)
      setFilterToAppply(filter)
    },
    []
  )

  const contentRender = useCallback(
    (props: any) => {

      const fields: {
        caption?: string
        width?: number
        dataField: string
        dataType: DataType
        format?: string
      }[] = [
        {
          caption: 'ID',
          width: 50,
          dataField: PrefilterTokensField.Id,
          dataType: 'number',
        },
        {
          caption: PrefilterTokensLabel.Symbol,
          width: 50,
          dataField: PrefilterTokensField.Symbol,
          dataType: 'string',
        },
        {
          caption: PrefilterTokensLabel.Name,
          dataField: PrefilterTokensField.Name,
          dataType: 'string',
        },
        {
          caption: PrefilterTokensLabel.Price,
          dataField: PrefilterTokensField.Price,
          dataType: 'number',
          format: 'currency',
        },
        {
          caption: PrefilterTokensLabel.MarketCap,
          dataField: PrefilterTokensField.MarketCap,
          dataType: 'number',
          format: 'currency',
        },
        {
          caption: PrefilterTokensLabel.FullyDilutedValuation,
          dataField: PrefilterTokensField.FullyDilutedValuation,
          dataType: 'number',
          format: 'currency',
        },
        {
          caption: PrefilterTokensLabel.Tokenomics,
          dataField: PrefilterTokensField.Tokenomics,
          dataType: 'number',
          // format: 'percentage',
        },
        {
          caption: PrefilterTokensLabel.Volume,
          dataField: PrefilterTokensField.Volume,
          dataType: 'number',
        },
        {
          caption: PrefilterTokensLabel.Chains,
          dataField: PrefilterTokensField.Chains,
          dataType: 'string',
        },
        {
          caption: PrefilterTokensLabel.IsErc20,
          dataField: PrefilterTokensField.IsErc20,
          dataType: 'boolean',
        },
        {
          caption: PrefilterTokensLabel.Categories,
          dataField: PrefilterTokensField.Categories,
          dataType: 'string',
        },
      ]

      return (
        <CustomFilterBuilder
          {...props}
          onApplyFilter={handleApplyFilterCache}
          predefinedFilters={predefinedFilters}
          fields={fields}
          loadFilterValues={loadFilterValues}
          appliedFilterValue={filterValueRef.current}
          filterToAppply={filterToAppply}
        />
      )
    },
    [filterToAppply, handleApplyFilterCache, loadFilterValues, predefinedFilters]
  )

  return (
    <div>
      {!loading && (
        <DataGridDef
          id="prefilter-tokens-table"
          dataSource={dataSource}
          showBorders={true}
          ref={datagrid}
          allowColumnReordering={true}
          columnHidingEnabled={true}
          onExporting={onExporting}
          filterBuilder={filterBuilder}
          filterValue={filterValueRef.current}
          filterSyncEnabled={true}
          onFilterValueChange={onFilterValueChange}
          onContentReady={updatePrefilteredTokens}
        >
          <FilterRow visible={true} />
          <FilterPanel
            visible={true}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customizeText={(e: any) => `Click here to refine filter model: ${e.text}`}
          />

          <FilterBuilderPopup
            position={filterBuilderPopupPosition}
            showTitle={true}
            title="Filter Tokens"
            onDisposing={handleOnDisposing}
            ref={filterBuilderPopupRef}
            contentRender={contentRender}
            showCloseButton={true}
            toolbarItems={filterBuilderActions}
          />
          <HeaderFilter visible={false}>
            <Search enabled={true} />
          </HeaderFilter>
          <LoadPanel enabled />
          <Paging defaultPageSize={10} />
          <Pager
            visible={true}
            allowedPageSizes={allowedPageSizes}
            displayMode="full"
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
          />
          <ColumnChooser enabled={true} />
          <Column
            dataField={PrefilterTokensField.Symbol}
            caption={PrefilterTokensLabel.Symbol}
            alignment="left"
            visible={true}
            minWidth={150}
            allowHiding={false}
            cellComponent={SymbolCellIdComponent}
          />
          <Column
            dataField={PrefilterTokensField.Price}
            caption={PrefilterTokensLabel.Price}
            alignment="right"
            visible={true}
            dataType="number"
            minWidth={175}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customizeText={(cellInfo: any) =>
              (cellInfo.value ?? 0).toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 6,
                minimumFractionDigits: 6,
              })
            }
            hidingPriority={11}
          />
          <Column
            dataField={PrefilterTokensField.MarketCap}
            caption={PrefilterTokensLabel.MarketCap}
            alignment="right"
            defaultSortOrder="desc"
            visible={true}
            dataType="number"
            minWidth={160}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customizeText={(cellInfo: any) =>
              (cellInfo.value ?? 0).toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              })
            }
            hidingPriority={10}
          />
          <Column
            dataField={PrefilterTokensField.FullyDilutedValuation}
            caption={PrefilterTokensLabel.FullyDilutedValuation}
            alignment="right"
            visible={true}
            dataType="number"
            minWidth={190}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customizeText={(cellInfo: any) =>
              (cellInfo.value ?? 0).toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              })
            }
            hidingPriority={6}
          />
          <Column
            dataField={PrefilterTokensField.Tokenomics}
            caption={PrefilterTokensLabel.Tokenomics}
            alignment="right"
            visible={true}
            dataType="number"
            minWidth={130}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customizeText={(cellInfo: any) =>
              (cellInfo.value ?? 0).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 2 })
            }
            hidingPriority={9}
          />
          <Column
            dataField={PrefilterTokensField.Volume}
            caption={PrefilterTokensLabel.Volume}
            alignment="right"
            visible={true}
            dataType="number"
            minWidth={140}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customizeText={(cellInfo: any) =>
              (cellInfo.value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 })
            }
            hidingPriority={7}
          />
          <Column
            dataField={PrefilterTokensField.Chains}
            caption={PrefilterTokensLabel.Chains}
            alignment="left"
            visible={true}
            dataType="string"
            calculateFilterExpression={calculateFilterExpression}
            filterOperations={categoriesFilterOperations}
            minWidth={150}
            width={200}
            allowHiding={true}
            hidingPriority={4}
          >
            <HeaderFilter visible={true} dataSource={chainsHeaderFilter.dataSource as DataSourceOptions}>
              <Search enabled={false} />
            </HeaderFilter>
          </Column>
          <Column
            dataField={PrefilterTokensField.IsErc20}
            caption={PrefilterTokensLabel.IsErc20}
            alignment="center"
            visible={true}
            dataType="boolean"
            minWidth={130}
            hidingPriority={8}
          />
          <Column
            dataField={PrefilterTokensField.Categories}
            caption={PrefilterTokensLabel.Categories}
            alignment="left"
            visible={true}
            dataType="string"
            calculateFilterExpression={calculateFilterExpression}
            filterOperations={categoriesFilterOperations}
            minWidth={150}
            width={200}
            hidingPriority={5}
          >
            <HeaderFilter visible={true} dataSource={categoriesHeaderFilter.dataSource as DataSourceOptions}>
              <Search enabled={false} />
            </HeaderFilter>
          </Column>
          <Column
            dataField={PrefilterTokensField.CirculatingSupply}
            caption={PrefilterTokensLabel.CirculatingSupply}
            alignment="right"
            visible={false}
            dataType="number"
            minWidth={200}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customizeText={(cellInfo: any) =>
              (cellInfo.value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 })
            }
            hidingPriority={3}
          />
          <Column
            dataField={PrefilterTokensField.TotalSupply}
            caption={PrefilterTokensLabel.TotalSupply}
            alignment="right"
            visible={false}
            dataType="number"
            minWidth={200}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customizeText={(cellInfo: any) =>
              (cellInfo.value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 })
            }
            hidingPriority={2}
          />
          <Column
            dataField={PrefilterTokensField.MaxSupply}
            caption={PrefilterTokensLabel.MaxSupply}
            alignment="right"
            visible={false}
            dataType="number"
            minWidth={250}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customizeText={(cellInfo: any) =>
              (cellInfo.value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 })
            }
            hidingPriority={1}
          />
          <Column
            dataField={PrefilterTokensField.Id}
            caption={PrefilterTokensLabel.Id}
            alignment="center"
            visible={false}
            minWidth={100}
            hidingPriority={0}
          />
          <Export enabled={true} allowExportSelectedData={true} />
        </DataGridDef>
      )}
    </div>
  )
}
