/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICategory } from "components/src/models/token/ICatigory"
import { ICoin } from "components/src/models/token/ICoin"
import { IPlatform } from "components/src/models/token/IPlatform"
import DataGridDef, {
  Column,
  ColumnChooser,
  ColumnChooserSearch,
  ColumnChooserSelection,
  Export,
  FilterBuilderPopup,
  FilterPanel,
  FilterRow,
  HeaderFilter,
  LoadPanel,
  Pager,
  Paging,
  Position,
  Search,
  Sorting,
} from "devextreme-react/data-grid"
import DataSource from "devextreme/data/data_source"
import { ExportingEvent } from "devextreme/ui/data_grid"
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { PrefilterTokensField, PrefilterTokensLabel } from "../../constants/PrefilterTokensTable"
import { SymbolCellIdComponent } from "./SymbolCellIdComponent"

export interface IPrefilterTokensTable {
  onCurrentFilterChange: (object?: object[] | null | undefined) => void;
  currentFilter?: object[] | null | undefined;
  dataSource: DataSource;
  onFilterBuilderOpen: Function;
  onSorterChanged: (sorter: any) => void;
  onExport: (e: ExportingEvent<ICoin, any>) => void;
}

export const PrefilterTokensTable: FC<IPrefilterTokensTable> = ({
  onCurrentFilterChange,
  dataSource,
  currentFilter,
  onFilterBuilderOpen,
  onSorterChanged,
  onExport,
}) => {
  const [currentSorter, setCurrentSorter] = useState<any>();

  const datagrid = React.createRef<DataGridDef<ICoin, string>>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const filterPanelText = useRef<Element | null>(null);

  const updatePrefilteredTokens = useCallback(async (): Promise<void> => {
    const grid = datagrid?.current?.instance;

    if (!grid) return;

    datagrid?.current?.instance?.filter(currentFilter);
    await grid.refresh();
    const gridFilter = grid.getCombinedFilter(true);

    handleOnUpdate();
  }, [currentFilter, datagrid]);

  const onSortingChanged = e => {
    const sortedColumns = e.component.getDataSource().sort();
    setCurrentSorter(sortedColumns);
  };

  useEffect(() => {
    handleOnUpdate();
  }, [currentSorter]);

  const handleOnUpdate = () => {
    const dataGrid = datagrid?.current?.instance;
    if (!dataGrid) {
      return;
    }

    const gridDataSource = dataGrid.getDataSource();
    const sort = gridDataSource.sort();
    onSorterChanged(sort);
  };

  useEffect(() => {
    const grid = datagrid?.current?.instance;
    if (!grid) return;
    updatePrefilteredTokens();
  }, [currentFilter, datagrid, updatePrefilteredTokens]);

  const onApplyFilter = useCallback(
    (filter: string | any[] | (() => any)) => {
      onCurrentFilterChange(filter as object[]);
    },
    [onCurrentFilterChange],
  );

  const handleFilterTextClick = useCallback(
    (_event: Event) => {
      onFilterBuilderOpen();
    },
    [onFilterBuilderOpen],
  );

  const onContentReady = () => {
    if (filterPanelText.current) {
      filterPanelText.current.removeEventListener("click", handleFilterTextClick);
    }

    const filterPanelTextDiv = containerRef.current?.querySelector(".dx-datagrid-filter-panel-text");
    if (filterPanelTextDiv) {
      filterPanelText.current = filterPanelTextDiv;
      filterPanelTextDiv.addEventListener("click", handleFilterTextClick);
    }
  };

  return (
    <div ref={containerRef}>
      <DataGridDef<ICoin>
        onOptionChanged={e => {
          if (e.fullName.startsWith("columns") && e.fullName.endsWith("sortOrder")) {
            setTimeout(() => {
              onSortingChanged(e);
            });
          }
        }}
        remoteOperations={{
          filtering: true,
          sorting: true,
          paging: true,
        }}
        id="prefilter-tokens-table"
        dataSource={dataSource}
        showBorders={true}
        ref={datagrid}
        width="100%"
        columnAutoWidth={true}
        allowColumnReordering={true}
        columnHidingEnabled={false}
        onExporting={onExport}
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
            e.cancel = true;
          }}
        />
        <Sorting mode="single" />
        <HeaderFilter visible={false}>
          <Search enabled={true} />
        </HeaderFilter>
        <LoadPanel enabled />
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          allowedPageSizes={[5, 10, 20, 50]}
          displayMode="full"
          showPageSizeSelector={true}
          showInfo={true}
          showNavigationButtons={true}
        />
        <ColumnChooser
          height={500}
          enabled={true}
          mode="select">
          <Position
            my="right top"
            at="right bottom"
            of=".dx-datagrid-column-chooser-button"
          />

          <ColumnChooserSearch
            enabled={true}
            editorOptions={true}
          />

          <ColumnChooserSelection
            allowSelectAll={true}
            selectByClick={true}
            recursive={true}
          />
        </ColumnChooser>
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
        />
        <Column
          dataField={PrefilterTokensField.Chains}
          caption={PrefilterTokensLabel.Chains}
          alignment="left"
          visible={true}
          dataType="string"
          minWidth={150}
          width={200}
          allowHiding={true}>
        </Column>
        <Column
          dataField={PrefilterTokensField.IsErc20}
          caption={PrefilterTokensLabel.IsErc20}
          alignment="center"
          visible={true}
          dataType="boolean"
          minWidth={130}
        />
        <Column
          dataField={PrefilterTokensField.Categories}
          caption={PrefilterTokensLabel.Categories}
          alignment="left"
          visible={true}
          dataType="string"
          minWidth={150}
          width={200}>
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
        />
        <Column
          dataField={PrefilterTokensField.Id}
          caption={PrefilterTokensLabel.Id}
          alignment="center"
          visible={false}
          minWidth={100}
        />
        <Export
          enabled={true}
          allowExportSelectedData={true}
        />
      </DataGridDef>
    </div>
  );
};
