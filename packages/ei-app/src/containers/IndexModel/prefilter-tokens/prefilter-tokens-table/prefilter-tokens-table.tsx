import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DataSource, { DataSourceOptions } from 'devextreme/data/data_source'
// eslint-disable-next-line import/no-named-as-default
import DataGrid, {
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
// eslint-disable-next-line import/no-named-as-default
import { Workbook } from 'exceljs'
import LocalStore from 'devextreme/data/local_store'
import { exportDataGrid } from 'devextreme/excel_exporter'
import { saveAs } from 'file-saver-es'
import { PositionConfig } from 'devextreme/animation/position'
import { ItemClickEvent } from 'devextreme/ui/list'
// eslint-disable-next-line import/no-named-as-default
import Box, { Item } from 'devextreme-react/box'
// eslint-disable-next-line import/no-named-as-default
import Form, { SimpleItem } from 'devextreme-react/form'
import { Button } from 'devextreme-react'

import { SymbolCellIdComponent } from '@/components/common/inputs/symbol-lookup/symbol-lookup'
import BackendApiService, { ICategory, IPlatform, IPrefilterTokensFilterValues } from '@/services/backend-api.service'
import { useBackendApi } from '../../backend-api-hook'
// eslint-disable-next-line import/no-named-as-default
import { IPrefilterTokensDataRow, IPrefilterTokensTable } from './prefilter-tokens-table.types'
import { PrefilterTokensField, PrefilterTokensLabel } from './prefilter-tokens-table.constants'
import { ITokenSetAllocation } from '../../IndexModel.types'

export const PrefilterTokensTable: FC<IPrefilterTokensTable> = ({ tabType, onUpdate }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isDataLoading, setDataLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<string[]>()
  const [chains, setChains] = useState<string[]>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datagrid = React.createRef<DataGrid<IPrefilterTokensDataRow, any>>()
  const filterBuilderPopupRef = React.createRef<FilterBuilderPopup>()
  const allowedPageSizes = [5, 10, 20, 50]

  const store = useMemo(() => new LocalStore({
    key: 'id',
    immediate: true,
    name: 'prefilterTokensTable',
  }), [])

  const dataSource = useMemo(() => new DataSource({
    store: store,
  }), [store])

  const { fetchData } = useBackendApi()

  const updatePrefilteredTokens = useCallback(async ():Promise<void> => {
    try {
      const grid = datagrid?.current?.instance
      if (isDataLoading && grid && store && dataSource) {
        const filterExpr = grid.getCombinedFilter(true)
        const filteredDataSource = grid.getDataSource()
        const loadOptions = dataSource.loadOptions()

        await filteredDataSource
          .store()
          .load({ filter: filterExpr, sort: loadOptions.sort, group: loadOptions.group })
          .then((result) => {
            const prefilteredTokenData = [] as ITokenSetAllocation[]

            const foo = result as IPrefilterTokensDataRow[]
            foo.forEach(row => {
              const prefilteredTokenRow = {} as ITokenSetAllocation
              prefilteredTokenRow.id = row.id
              prefilteredTokenRow.symbol = row.sym.toUpperCase()
              prefilteredTokenRow.price = row.price
              prefilteredTokenRow.marketCap = row.mCap

              prefilteredTokenData.push(prefilteredTokenRow)
            })
            onUpdate(prefilteredTokenData)
          })
          .catch(err => {
            console.error('Error on updatePrefilteredTokens filteredDataSource:', err)
          })

          setDataLoading(false)
      }
    } catch (err) {
      console.error('Error on updatePrefilteredTokens:', err)
    }
  }, [datagrid, isDataLoading, onUpdate, store, dataSource])

  const loadData = useCallback(async () => {
    try {
      const coinGeckoCategories = localStorage.getItem('coinGeckoCategories')
      if (coinGeckoCategories !== null && dataSource) {
        const categoryList:string[] = []
        const categoryData:ICategory[] = JSON.parse(coinGeckoCategories)
        categoryData.forEach(cat => {
          categoryList.push(cat.name)
        })
        categoryList.sort()
        setCategories(categoryList)
        setDataLoading(true)
      }

      const coinGeckoChains = localStorage.getItem('coinGeckoChains')
      if (coinGeckoChains !== null && dataSource) {
        const chainsList:string[] = []
        const chainsData:IPlatform[] = JSON.parse(coinGeckoChains)
        chainsData.forEach(chain => {
          if (chain.id.length > 0) {
            chainsList.push(chain.id)
          }
        })
        chainsList.sort()
        setChains(chainsList)
        setDataLoading(true)
      }

      await dataSource.reload()

      setLoading(false)
    } catch (err) {
      console.error('Error on loadData:', err)
    }
  }, [dataSource])

  const refreshData = async ():Promise<void> => {
    try {
      await fetchData()
      await loadData()
    } catch(e) {
      console.error(e)
    }
  }

  const categoryToFilterItem = (item: string): {text: string, value: string} => {
    return {
      text: item,
      value: item
    }
  }

  const categoriesFilterOperations = ["contains", "anyof", "endswith", "=", "startswith"]
  const categoriesHeaderFilter = {
    dataSource: {
      store: {
        type: "array",
        data: categories
      },
      map: categoryToFilterItem
    }
  }

  const chainsToFilterItem = (item: string): {text: string, value: string} => {
    return {
      text: item,
      value: item
    }
  }
  const chainsHeaderFilter = {
    dataSource: {
      store: {
        type: "array",
        data: chains
      },
      map: chainsToFilterItem
    }
  }

  const [predefinedFilter, setPredefinedFilter] = useState<IPrefilterTokensFilterValues[]>([] as IPrefilterTokensFilterValues[])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateFilterExpression = useCallback(function(this: any, filterValue: any, selectedFilterOperation:string | null, _target: string):any {
    try {
      let column = this
      if (filterValue) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let selector = (data:any): boolean => {
          let applyOperation = (arg1:string, arg2:string, op:string):boolean => {
            if (op === "=") return arg1.toUpperCase() === arg2.toUpperCase()
            if (op === "anyof") return arg1.toUpperCase().includes(arg2.toUpperCase())
            if (op === "contains") return arg1.toUpperCase().includes(arg2.toUpperCase())
            if (op === "startswith") return arg1.toUpperCase().startsWith(arg2.toUpperCase())
            if (op === "endswith") return arg1.toUpperCase().endsWith(arg2.toUpperCase())

            return false
          }

          let values = column.calculateCellValue(data)
          return (
            values &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !!values.find((v:any) =>
              applyOperation(v, filterValue, selectedFilterOperation ?? '')
            )
          )
        }

        return [selector, "=", true]
      }

      console.log('filter default')
      return column.defaultCalculateFilterExpression.apply(this, arguments)
    } catch (err) {
      console.error('Error on calculateFilterExpression:', err)
    }
  }, [])

  const filterBuilderPopupPosition: PositionConfig = {
    of: window,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFilterValueChange = useCallback(async (value:any):Promise<void> => {
    try {
      console.log('onFilterValueChange:', value)
      const fromFilterBuilder = !Array.isArray(value) && value?.value
      filterValueRef.current = fromFilterBuilder ? value.value : value

      if (filterValueRef && filterValueRef.current) {
        localStorage.setItem(`${tabType}PrefilterTokensFilterValues`, JSON.stringify(filterValueRef.current))
      } else {
        localStorage.setItem(`${tabType}PrefilterTokensFilterValues`, JSON.stringify([]))
      }

      setDataLoading(true)
      await updatePrefilteredTokens()
    } catch (err) {
      console.error('Error on onFilterValueChange:', err)
    }
  }, [tabType, updatePrefilteredTokens])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onExporting = async (e: any):Promise<void> => {
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Main sheet')

    const currentDate = new Date()

    await exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(async () => {
      await workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `TokenSets-Model-Prefilter-Tokens-${currentDate.toISOString().split('T')[0]}.xlsx`)
      })
    })
    e.cancel = true
  }

  const loadFilterValues = useCallback(async ():Promise<void> => {
    let filterValues = await BackendApiService.getTokensFilters()
    setPredefinedFilter(filterValues)
  }, [])

  useEffect(() => {
    const filterValueJson = localStorage.getItem(`${tabType}PrefilterTokensFilterValues`)

    if (filterValueJson && filterValueJson?.length > 0) {
      filterValueRef.current = JSON.parse(filterValueJson)
    } else {
      filterValueRef.current = []
    }
    void loadFilterValues()
    void refreshData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const predefinedFilterOnItemClick = useCallback(async (e: ItemClickEvent<{ text: string; icon: string; filter: string[]; }>) => {
    console.log('predefinedFilterOnItemClick:', e)
    const grid = datagrid?.current?.instance

    grid?.clearFilter()
    grid?.filter(e.itemData?.filter)

    await onFilterValueChange(e.itemData?.filter)

    await grid?.refresh()
  }, [datagrid, onFilterValueChange])

  const predefinedFilterListOptions = useMemo(() => {
    return {
      onItemClick: predefinedFilterOnItemClick,
      dataSource: predefinedFilter,
      placeholder: 'Select a Predefined Filter...',
      lable: 'Predefined Filter',
      width: 225
    }
  }, [predefinedFilter, predefinedFilterOnItemClick])
  const filterNameOptions = useMemo(() => {
    return {
      placeholder: 'Filter Name',
      lable: 'Filter Name',
      width: 225
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderContent = useCallback(() =>  {
    const formData = {
      predefinedFilter: '',
      filterName: 'test',
    }
    return (
      <div>
        <Box
          direction="row"
          height={25}
          width="100%"
        >
          <Item
            baseSize={125}
            ratio={1}
          >
            <span>Filter Tokens</span>
          </Item>
          <Item
            baseSize={225}
            ratio={10}
          >
            <Form
              formData={formData}
              labelLocation='left'
              colCount={3}
            >
              <SimpleItem
                dataField="predefinedFilter"
                editorType="dxSelectBox"
                editorOptions={predefinedFilterListOptions}
              />
              <SimpleItem
                dataField="filterName"
                editorType="dxTextBox"
                editorOptions={filterNameOptions}
              />
              <Button text="Save" />
            </Form>
          </Item>
          <Item
            ratio={1}
          >
          </Item>
          <Item
            baseSize={125}
            ratio={1}
          >
            <Button text="Save" />
          </Item>
          <Item
            ratio={1}
          >
          </Item>
          <Item
            baseSize={125}
            ratio={1}
          >
            <Button text="Save As" />
          </Item>
          <Item
            ratio={1}
          >
          </Item>
          <Item
            baseSize={125}
            ratio={1}
          >
            <Button text="Delete" />
          </Item>
          <Item
            ratio={1}
          >
          </Item>
        </Box>
      </div>
    )
  }, [filterNameOptions, predefinedFilterListOptions])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterBuilderPopupShowing = useCallback((e: any) => {
    console.log('handleFilterBuilderPopupShowing:', e)
    console.log('handleFilterBuilderPopupShowing datagrid:', datagrid.current)
    console.log('handleFilterBuilderPopupShowing filterBuilderPopupRef:', filterBuilderPopupRef.current)
  }, [datagrid, filterBuilderPopupRef])

  return (
    <div>
      {!loading &&
        <DataGrid
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
            onShowing={handleFilterBuilderPopupShowing}
            ref={filterBuilderPopupRef}
            titleComponent={renderContent}
          >
            {/*
            <ToolbarItem
              widget="dxSelectBox"
              toolbar="top"
              location="after"
              options={predefinedFilterListOptions}
            />
            */}
          </FilterBuilderPopup>
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
            showNavigationButtons={true} />
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
              (cellInfo.value ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 6 })
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
              (cellInfo.value ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0 })
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
              (cellInfo.value ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0 })
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
        </DataGrid>
      }
    </div>
  )
}
