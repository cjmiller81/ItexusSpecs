/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICoin } from "components/src/models/token/ICoin";
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
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import { ExportingEvent } from "devextreme/ui/data_grid";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChainCell } from "./ChainCell";
import { toDollarAmountField, toPercentageField, toPoolCellField } from "./helpers";
import { PoolData } from "./Models/PoolData";
import { ProjectCellComponent } from "./ProjectCellComponent";
import { DefiField, DefiLabel } from "./tableConstants";
import { useAppSelector } from "@/libs/redux/Store";

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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const datagrid = React.createRef<DataGridDef<PoolData, string>>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const filterPanelText = useRef<Element | null>(null);
  const { sidebarOpened } = useAppSelector(store => store.ui);
  const allowedPageSizes = useMemo(() => [5, 10, 20, 50], []);
  const updateScreenWidth = useCallback(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, [updateScreenWidth]);

  const updatePrefilteredTokens = useCallback(async (): Promise<void> => {
    const grid = datagrid?.current?.instance;
    if (!grid) return;

    const filteredDataSource = grid.getDataSource();
    datagrid?.current?.instance?.filter(currentFilter);
    await grid.refresh();
    const prefilteredData = filteredDataSource.items() as ICoin[];
    onUpdate(prefilteredData);
  }, [datagrid, currentFilter, onUpdate]);

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
      <DataGridDef<PoolData>
        id="defi-tokens-table"
        dataSource={dataSource}
        keyExpr="ID"
        columnAutoWidth={true}
        showRowLines={true}
        width={`${sidebarOpened ? screenWidth - 300 : screenWidth - 130}px`}
        showBorders={true}
        ref={datagrid}
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
          dataField={DefiField.Symbol}
          caption={DefiLabel.Symbol}
          alignment="left"
          visible={true}
          dataType="string"
          allowHiding={true}
          cellComponent={toPoolCellField}
        />
        <Column
          dataField={DefiField.Project}
          caption={DefiLabel.Project}
          alignment="left"
          visible={true}
          dataType="string"
          allowHiding={true}
          cellComponent={ProjectCellComponent}
        />
        <Column
          dataField={DefiField.Chain}
          caption={DefiLabel.Chain}
          alignment="left"
          visible={true}
          dataType="string"
          allowHiding={true}
          cellComponent={ChainCell}
        />
        <Column
          dataField={DefiField.TVL}
          caption={DefiLabel.TVL}
          alignment="left"
          visible={true}
          dataType="number"
          allowHiding={true}
          customizeText={toDollarAmountField}
        />
        <Column
          dataField={DefiField.APY}
          caption={DefiLabel.APY}
          alignment="left"
          visible={true}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.ApyBase}
          caption={DefiLabel.ApyBase}
          alignment="left"
          visible={true}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.APYReward}
          caption={DefiLabel.APYReward}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />

        <Column
          dataField={DefiField.ApyBase7d}
          caption={DefiLabel.ApyBase7d}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.Il7d}
          caption={DefiLabel.Il7d}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.ApyMean30d}
          caption={DefiLabel.ApyMean30d}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />

        <Column
          dataField={DefiField.VolumeUsd1d}
          caption={DefiLabel.VolumeUsd1d}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toDollarAmountField}
        />

        <Column
          dataField={DefiField.VolumeUsd7d}
          caption={DefiLabel.VolumeUsd7d}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toDollarAmountField}
        />
        <Column
          dataField={DefiField.ApyBaseInception}
          caption={DefiLabel.ApyBaseInception}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.ApyPct1D}
          caption={DefiLabel.ApyPct1D}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.ApyPct7D}
          caption={DefiLabel.ApyPct7D}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.RewardTokens}
          caption={DefiLabel.RewardTokens}
          alignment="left"
          visible={false}
          dataType="object"
          allowHiding={true}
        />
        <Column
          dataField={DefiField.Sigma}
          caption={DefiLabel.Sigma}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.Mu}
          caption={DefiLabel.Mu}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.Count}
          caption={DefiLabel.Count}
          alignment="left"
          visible={false}
          dataType="number"
          allowHiding={true}
        />
        <Column
          dataField={DefiField.Outlier}
          caption={DefiLabel.Outlier}
          alignment="left"
          visible={false}
          dataType="boolean"
          allowHiding={true}
        />
        <Column
          dataField={DefiField.Stablecoin}
          caption={DefiLabel.Stablecoin}
          alignment="left"
          visible={false}
          dataType="boolean"
          allowHiding={true}
        />
        <Export
          enabled={true}
          allowExportSelectedData={true}
        />
      </DataGridDef>
    </div>
  );
};
