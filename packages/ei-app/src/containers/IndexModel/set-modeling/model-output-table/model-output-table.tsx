import React, { FC, useCallback, useEffect, useState } from 'react'
import DataSource from 'devextreme/data/data_source'
import DataGridDef, {
  Column,
  Editing,
  Export,
} from 'devextreme-react/data-grid'
import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver-es'
import { exportDataGrid } from 'devextreme/excel_exporter'

import { SymbolCellIdComponent } from '@/components/common/inputs/symbol-lookup/symbol-lookup'
import { IModelOutputDataRow, IModelOutputTable } from './model-output-table.types'
import { ModelOutputField, ModelOutputLabel } from './model-output-table.constants'
import { calculateWeightValue } from './model-output-table.utils'
import { ITokenSetAllocation } from '../../IndexModel.types'

export const ModelOutputTable: FC<IModelOutputTable> = ({ prefilteredTokenData, tabType, onModelSetModelingUpdate, tokenCount, startPrice }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datagrid = React.createRef<DataGridDef<IModelOutputDataRow, any>>()
  const [modelSetModelingTableStore, setModelSetModelingTableStore] = useState<ITokenSetAllocation[]>([] as ITokenSetAllocation[])

  const [dataSource, setDataSource] = useState<DataSource>(new DataSource({
    store: modelSetModelingTableStore,
  }))

  const weightOptions = {
    showClearButton: false,
    showSpinButtons: false,
    format: "#0.00%" ,
    disabled: true,
  }

  const calculateQtyValue = useCallback(
    (rowData: ITokenSetAllocation): number => {
      const qty = (calculateWeightValue(tabType, rowData.marketCap, prefilteredTokenData) * startPrice) / rowData.price
      return qty
    },
    [prefilteredTokenData, startPrice, tabType]
  )

  const calculateWeightCellValue = useCallback(
    (rowData: ITokenSetAllocation) => {
      const weight = calculateWeightValue(tabType, rowData.marketCap, prefilteredTokenData)
      return weight.toLocaleString(undefined, {style: 'percent', minimumFractionDigits:2})
    },
    [prefilteredTokenData, tabType]
  )

  const formatCurrencyCellValue = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cellInfo: any) => {
      return (cellInfo.value ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0 })
    },
    []
  )

  const formatQtyCellValue = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cellInfo: any) => {
      return (cellInfo.value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 6, minimumFractionDigits: 6 })
    },
    []
  )

  const loadData = useCallback(async ():Promise<void> => {
    if (prefilteredTokenData !== null && prefilteredTokenData.length > 0) {
      let sortedFilteredData:ITokenSetAllocation[] = prefilteredTokenData.sort((a, b) => {
        if (a.marketCap < b.marketCap) {
          return 1
        }
        if (a.marketCap > b.marketCap) {
          return -1
        }
        // a must be equal to b
        return 0
      }).slice(0, tokenCount)

      if (JSON.stringify(modelSetModelingTableStore) !== JSON.stringify(sortedFilteredData)) {
        setModelSetModelingTableStore(sortedFilteredData)
        onModelSetModelingUpdate(sortedFilteredData)
      }
    }
  }, [modelSetModelingTableStore, onModelSetModelingUpdate, prefilteredTokenData, tokenCount])

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
      await workbook.xlsx.writeBuffer().then((value) => {
        saveAs(new Blob([value], { type: 'application/octet-stream' }), `TokenSets-Model-${currentDate.toISOString().split('T')[0]}.xlsx`)
      })
    })
    e.cancel = true
  }

  useEffect(() => {
    if (prefilteredTokenData !== null && prefilteredTokenData.length > 0) {
      if ((modelSetModelingTableStore && modelSetModelingTableStore.length !== 0)) {
        setDataSource(new DataSource({
          store: modelSetModelingTableStore,
        }))
      }

      void loadData()
    }
  }, [prefilteredTokenData, tokenCount, startPrice, loadData, modelSetModelingTableStore])

  return (
    <div>
      <DataGridDef
        id="model-output-table"
        dataSource={dataSource}
        showBorders={true}
        ref={datagrid}
        columnHidingEnabled={true}
        onExporting={onExporting}
      >
        <Editing
          mode="cell"
          allowUpdating={false}
          allowAdding={false}
          allowDeleting={false}
          confirmDelete={false}
        />
        <Column
          dataField={ModelOutputField.Symbol}
          caption={ModelOutputLabel.Symbol}
          alignment="left"
          visible={true}
          minWidth={150}
          allowHiding={false}
          cellComponent={SymbolCellIdComponent}
        />
        <Column
          dataField={ModelOutputField.Price}
          caption={ModelOutputLabel.Price}
          alignment="right"
          visible={true}
          minWidth={175}
          dataType="number"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          customizeText={formatCurrencyCellValue}
          hidingPriority={3}
        />
        <Column
          dataField={ModelOutputField.MarketCap}
          caption={ModelOutputLabel.MarketCap}
          alignment="right"
          visible={true}
          minWidth={160}
          dataType="number"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          customizeText={formatCurrencyCellValue}
          hidingPriority={1}
        />
        <Column
          dataField={ModelOutputField.Weight}
          caption={ModelOutputLabel.Weight}
          alignment="right"
          visible={true}
          minWidth={130}
          dataType="number"
          editorOptions={weightOptions}
          calculateCellValue={calculateWeightCellValue}
          hidingPriority={2}
        />
        <Column
          dataField={ModelOutputField.Qty}
          caption={ModelOutputLabel.Qty}
          alignment="right"
          visible={true}
          minWidth={130}
          dataType="number"
          calculateCellValue={calculateQtyValue}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          customizeText={formatQtyCellValue}
          hidingPriority={4}
        />
        <Column
          dataField={ModelOutputField.Id}
          caption={ModelOutputLabel.Id}
          alignment="center"
          visible={false}
          hidingPriority={0}
        />
        <Export enabled={true} allowExportSelectedData={true} />
      </DataGridDef>
    </div>
  )
}
