/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICoin } from "components/src/models/token/ICoin";
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
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import { ExportingEvent } from "devextreme/ui/data_grid";
import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { ChainCellComponent } from "./ChainCellComponent";
import { PoolData } from "./Models/PoolData";
import { ProjectCellComponent } from "./ProjectCellComponent";
import { DefiField, DefiLabel } from "./tableConstants";

export interface IPrefilterTokensTable {
  loading: boolean;
  onCurrentFilterChange: (object?: object[] | null | undefined) => void;
  currentFilter?: object[] | null | undefined;
  dataSource: DataSource<PoolData, string>;
  onFilterBuilderOpen: Function;
  onUpdate: (filteredTokenData: ICoin[]) => void;
  onExport: (e: ExportingEvent<PoolData, any>) => void;
}

export const DefiPoolsTable: FC<IPrefilterTokensTable> = ({
  loading,
  onUpdate,
  onCurrentFilterChange,
  dataSource,
  currentFilter,
  onFilterBuilderOpen,
  onExport,
}) => {
  const datagrid = React.createRef<DataGridDef<PoolData, string>>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const filterPanelText = useRef<Element | null>(null);

  const allowedPageSizes = useMemo(() => [5, 10, 20, 50], []);

  const updatePrefilteredTokens = async (): Promise<void> => {
    const grid = datagrid?.current?.instance;

    if (!grid) return;

    const filteredDataSource = grid.getDataSource();
    datagrid?.current?.instance?.filter(currentFilter);
    await grid.refresh();
    const prefilteredData = filteredDataSource.items() as ICoin[];
    onUpdate(prefilteredData);
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

  const toPercentageField = (cellInfo: any) => {
    const { value } = cellInfo;
    if (!value) return "";
    return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  };

  return (
    <div ref={containerRef}>
      <DataGridDef<PoolData>
        id="defi-tokens-table"
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
            e.cancel = true;
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
          dataField={DefiField.Symbol}
          caption={DefiLabel.Symbol}
          alignment="left"
          visible={true}
          dataType="string"
          allowHiding={false}
        />
        <Column
          dataField={DefiField.Project}
          caption={DefiLabel.Project}
          alignment="left"
          visible={true}
          dataType="string"
          allowHiding={false}
          cellComponent={ProjectCellComponent}
        />
        <Column
          dataField={DefiField.Chain}
          caption={DefiLabel.Chain}
          alignment="left"
          visible={true}
          dataType="string"
          allowHiding={false}
          cellComponent={ChainCellComponent}
        />
        <Column
          dataField={DefiField.TVL}
          caption={DefiLabel.TVL}
          alignment="left"
          visible={true}
          dataType="number"
          allowHiding={false}
          customizeText={(cellInfo: any) => {
            const { value } = cellInfo;
            if (!value) return "";
            if (value >= 1_000_000_000) {
              const billions = value / 1_000_000_000;
              return `$${billions.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}b`;
            } else if (value >= 1_000_000) {
              const millions = value / 1_000_000;
              return `$${millions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}m`;
            } else {
              return `$${value.toLocaleString()}`;
            }
          }}
        />
        <Column
          dataField={DefiField.APY}
          caption={DefiLabel.APY}
          alignment="left"
          visible={true}
          dataType="number"
          allowHiding={false}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.BaseAPY}
          caption={DefiLabel.BaseAPY}
          alignment="left"
          visible={true}
          dataType="number"
          allowHiding={false}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.ApyMean30d}
          caption={DefiLabel.ApyMean30d}
          alignment="left"
          visible={true}
          dataType="number"
          allowHiding={false}
          customizeText={toPercentageField}
        />
        <Export
          enabled={true}
          allowExportSelectedData={true}
        />
      </DataGridDef>
    </div>
  );
};
