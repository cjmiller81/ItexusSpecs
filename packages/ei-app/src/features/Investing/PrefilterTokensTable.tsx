/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICategory, ICoin, IPlatform } from "@/services/backend-api.service"
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
} from "devextreme-react/data-grid"
import DataSource from "devextreme/data/data_source"
import { ExportingEvent } from "devextreme/ui/data_grid"
import React, { FC, useCallback, useEffect, useRef } from "react"
import { PrefilterTokensField, PrefilterTokensLabel } from "../../constants/PrefilterTokensTable"
import { SymbolCellIdComponent } from "./SymbolCellIdComponent"

export interface IPrefilterTokensTable {
  loading: boolean
  onCurrentFilterChange: (object?: object[] | null | undefined) => void
  chains: IPlatform[]
  categories: ICategory[]
  currentFilter?: object[] | null | undefined
  dataSource: DataSource<ICoin, string>
  onFilterBuilderOpen: Function
  onUpdate: (filteredTokenData: ICoin[]) => void
  onExport: (e: ExportingEvent<ICoin, any>) => void
}

export const PrefilterTokensTable: FC<IPrefilterTokensTable> = ({
  loading,
  categories,
  chains,
  onUpdate,
  onCurrentFilterChange,
  dataSource,
  currentFilter,
  onFilterBuilderOpen,
  onExport,
}) => {
  const datagrid = React.createRef<DataGridDef<ICoin, string>>()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const filterPanelText = useRef<Element | null>(null)

  const allowedPageSizes = [5, 10, 20, 50]
  const updatePrefilteredTokens = useCallback(async (): Promise<void> => {
    const grid = datagrid?.current?.instance

    if (!grid) return

    const filteredDataSource = grid.getDataSource()
    datagrid?.current?.instance?.filter(currentFilter)
    await grid.refresh()
    const prefilteredData = filteredDataSource.items() as ICoin[]
    onUpdate(prefilteredData)
  }, [currentFilter, datagrid, onUpdate])

  useEffect(() => {
    const grid = datagrid?.current?.instance
    if (!grid) return
    updatePrefilteredTokens()
  }, [currentFilter, datagrid, updatePrefilteredTokens])

  const categoryToFilterItem = (item: string): { text: string; value: string } => {
    return {
      text: item,
      value: item,
    }
  }

  const categoriesFilterOperations = ["contains", "anyof", "endswith", "=", "startswith"]

  const chainsToFilterItem = (item: string): { text: string; value: string } => {
    return {
      text: item,
      value: item,
    }
  }

  const calculateFilterExpression = useCallback(function (
    this: any,
    filterValues: any,
    selectedFilterOperation: string | null,
    _target: string,
  ): any {
    try {
      let column = this
      if (filterValues) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let selector = (data: any): boolean => {
          let applyOperation = (arg1: string, arg2: string, op: string): boolean => {
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
            !!values.find((v: any) => applyOperation(v, filterValues, selectedFilterOperation ?? ""))
          )
        }

        return [selector, "=", true]
      }

      return column.defaultCalculateFilterExpression.apply(this, arguments)
    } catch (err) {
      console.error("Error on calculateFilterExpression:", err)
    }
  }, [])

  const onApplyFilter = (filter: string | any[] | (() => any)) => {
    onCurrentFilterChange(filter as object[])
  }

  const handleFilterTextClick = useCallback((_event: Event) => {
    onFilterBuilderOpen()
  }, [onFilterBuilderOpen])

  const onContentReady = () => {
    if (filterPanelText.current) {
      filterPanelText.current.removeEventListener("click", handleFilterTextClick)
    }

    const filterPanelTextDiv = containerRef.current?.querySelector(".dx-datagrid-filter-panel-text")
    if (filterPanelTextDiv) {
      filterPanelText.current = filterPanelTextDiv
      filterPanelTextDiv.addEventListener("click", handleFilterTextClick)
    }
  }

  return (
    <div ref={containerRef}>
      <DataGridDef<ICoin>
        id="prefilter-tokens-table"
        dataSource={dataSource}
        showBorders={true}
        ref={datagrid}
        allowColumnReordering={true}
        columnHidingEnabled={true}
        onExporting={onExport}
        width="99%"
        filterBuilder={{
          customOperations: [],
          allowHierarchicalFields: true,
        }}
        filterValue={currentFilter || []}
        onContentReady={onContentReady}
        filterSyncEnabled={true}
        onFilterValueChange={onApplyFilter}>
        <FilterRow visible={true} />
        <FilterPanel
          visible={true}
          customizeText={e => `Click here to refine filter model: ${e.text}`}
        />

        <FilterBuilderPopup
          onShowing={e => {
            e.cancel = true
          }}
        />

        <HeaderFilter visible={false}>
          <Search enabled={true} />
        </HeaderFilter>
        <LoadPanel
          showPane={loading}
          enabled
        />
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
              style: "currency",
              currency: "USD",
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
          customizeText={(cellInfo: any) =>
            (cellInfo.value ?? 0).toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
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
              style: "currency",
              currency: "USD",
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
          customizeText={(cellInfo: any) =>
            (cellInfo.value ?? 0).toLocaleString(undefined, {
              style: "percent",
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })
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
          hidingPriority={4}>
          <HeaderFilter
            visible={true}
            dataSource={{
              store: {
                type: "array",
                data: chains,
              },
              map: chainsToFilterItem,
            }}>
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
          hidingPriority={5}>
          <HeaderFilter
            visible={true}
            dataSource={{
              store: {
                type: "array",
                data: categories,
              },
              map: categoryToFilterItem,
            }}>
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
        <Export
          enabled={true}
          allowExportSelectedData={true}
        />
      </DataGridDef>
    </div>
  )
}
