import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import DataSource from 'devextreme/data/data_source'
import DataGrid, {
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
import { ModelSetModelingTableStoreContext } from '../../ModelLocalStoreContext'
import { ITokenSetAllocation } from '../../IndexModel.types'

export const ModelOutputTable: FC<IModelOutputTable> = ({ prefilteredTokenData, tabType, onModelSetModelingUpdate, tokenCount, startPrice }) => {
  const [dataSource, setDataSource] = useState<DataSource>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datagrid = React.createRef<DataGrid<IModelOutputDataRow, any>>()

  const modelSetModelingTableStore = useContext(ModelSetModelingTableStoreContext)

  const calculateQtyValue = (rowData: ITokenSetAllocation): number => {
    const qty = (calculateWeightValue(tabType, rowData.marketCap, prefilteredTokenData) * startPrice) / rowData.price
    return qty
  }

  const weightOptions = {
    showClearButton: false,
    showSpinButtons: false,
    format: "#0.00%" ,
    disabled: true,
  }

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

      onModelSetModelingUpdate(sortedFilteredData)
    }
  }, [onModelSetModelingUpdate, prefilteredTokenData, tokenCount])

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
    // Init
    if (modelSetModelingTableStore) {
      setDataSource(new DataSource({
        store: modelSetModelingTableStore,
      }))
    }
    void loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (modelSetModelingTableStore) {
      setDataSource(new DataSource({
        store: modelSetModelingTableStore,
      }))
    }
  }, [modelSetModelingTableStore])

  useEffect(() => {
    void loadData()
  }, [prefilteredTokenData, tokenCount, startPrice, loadData])

  return (
    <div>
      <DataGrid
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
          customizeText={(cellInfo: any) =>
            (cellInfo.value ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 6 })
          }
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
          customizeText={(cellInfo: any) =>
            (cellInfo.value ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0 })
          }
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
          calculateCellValue={(rowData: ITokenSetAllocation) => {
            const weight = calculateWeightValue(tabType, rowData.marketCap, prefilteredTokenData)
            return weight.toLocaleString(undefined, {style: 'percent', minimumFractionDigits:2})
          }}
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
          customizeText={(cellInfo: any) =>
            (cellInfo.value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 6, minimumFractionDigits: 6 })
          }
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
      </DataGrid>
    </div>
  )
}
