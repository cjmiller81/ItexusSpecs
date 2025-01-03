/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICoin } from "components/src/models/token/ICoin";
import { createFilter, deleteFilter, fetchFilters, updateFilter } from "@/libs/redux/Slices/AllTokensTableSlice";
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
  Item,
  LoadPanel,
  Pager,
  Paging,
  Position,
  Search,
  Toolbar,
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import { ExportingEvent } from "devextreme/ui/data_grid";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChainCell } from "./ChainCell";
import { toDollarAmountField, toPercentageField, toPoolCellField } from "./helpers";
import { PoolData } from "./Models/PoolData";
import { ProjectCellComponent } from "./ProjectCellComponent";
import { DefiField, defiFilterBuilderFields, DefiLabel } from "./tableConstants";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import SimpleBar from "simplebar-react";
import { CustomFilterBuilder } from "../Common/DevExpressTable/CustomFilterBuilder";
import { descOrderingAfterClick, reconfigureFilterPanelStyles } from "@/common/devextreme-filter";
import { StyledDataGridDef } from "@/features/Income/StyledDataGridDef";

export interface IPrefilterTokensTable {
  loading: boolean;
  dataSource: DataSource<PoolData, string>;
  onUpdate: (filteredTokenData: ICoin[]) => void;
  onExport: (e: ExportingEvent<PoolData, any>) => void;
}

export const DefiPoolsTable: FC<IPrefilterTokensTable> = ({ loading, onUpdate, dataSource, onExport }) => {
  const datagrid = React.createRef<DataGridDef<PoolData, string>>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { filters, deletingFilterStatus, creatingFilterStatus, updatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );
  const dispatch = useAppDispatch();
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>();
  const liquidityPoolFilters = useMemo(() => filters.filter(f => f.filterType === "liquidity-pool"), [filters]);
  const [filterBuildeOpen, setFilterBuilderOpen] = useState(false);
  const allowedPageSizes = useMemo(() => [5, 10, 20, 50], []);
  const filterPanelText = useRef<Element | null>(null);

  const updatePrefilteredTokens = useCallback(async (): Promise<void> => {
    const grid = datagrid?.current?.instance;
    if (!grid) return;

    const filteredDataSource = grid.getDataSource();
    datagrid?.current?.instance?.filter(currentFilter);
    await grid.refresh();
    const prefilteredData = filteredDataSource.items() as ICoin[];
    onUpdate(prefilteredData);
  }, [datagrid, currentFilter, onUpdate]);

  const onApplyFilter = useCallback(
    (filter: string | any[] | (() => any)) => {
      setCurrentFilter(filter as object[]);
    },
    [setCurrentFilter],
  );

  const onContentReady = () => {
    const filterPanelTextDiv = containerRef.current?.querySelector(".dx-datagrid-filter-panel-text");
    if (filterPanelTextDiv) {
      filterPanelText.current = filterPanelTextDiv;
      filterPanelTextDiv.addEventListener("click", () => {
        if (currentFilter && currentFilter.length > 0) {
          setFilterBuilderOpen(true);
        }
      });
    }

    reconfigureFilterPanelStyles(containerRef, currentFilter);
  };

  useEffect(() => {
    const grid = datagrid?.current?.instance;
    if (!grid) return;
  }, [currentFilter, datagrid]);

  return (
    <div ref={containerRef}>
      {/*@ts-ignore*/}
      <StyledDataGridDef<PoolData>
        id="defi-tokens-table"
        dataSource={dataSource}
        ref={datagrid}
        allowColumnReordering={true}
        columnHidingEnabled={false}
        keyExpr="ID"
        onCellClick={descOrderingAfterClick}
        columnAutoWidth={false}
        showRowLines={true}
        showBorders={true}
        onExporting={onExport}
        filterBuilder={{
          customOperations: [{ name: "contains", caption: "Contains" }],
          allowHierarchicalFields: true,
        }}
        filterValue={currentFilter || []}
        onContentReady={onContentReady}
        filterSyncEnabled={true}
        onFilterValueChange={onApplyFilter}>
        <FilterRow visible={true} />
        <FilterPanel
          visible={true}
          customizeText={e => (e.text ? e.text : "No Filter Applied")}
        />
        <FilterBuilderPopup
          onShowing={e => {
            e.cancel = true;
          }}
        />
        <HeaderFilter
          height={650}
          visible={true}>
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
        <Toolbar>
          <Item location="before">
            <SimpleBar style={{ maxHeight: "600px", width: "700px", overflowY: "hidden" }}>
              <CustomFilterBuilder
                filterType="liquidity-pool"
                filterBuilderFields={defiFilterBuilderFields}
                filterLoading={updatingFilterStatus === "loading" || creatingFilterStatus === "loading"}
                filterDeletingLoading={deletingFilterStatus === "loading"}
                open={filterBuildeOpen}
                onCreateFilter={filter => dispatch(createFilter(filter))}
                onClose={() => setFilterBuilderOpen(false)}
                onOpen={() => setFilterBuilderOpen(true)}
                predefinedFilters={liquidityPoolFilters}
                onUpdateFilter={filter => dispatch(updateFilter(filter))}
                onDisableFilter={() => setCurrentFilter(null)}
                onApply={filter => {
                  setCurrentFilter(filter);
                  setFilterBuilderOpen(false);
                }}
                filterToAppply={currentFilter}
                onDeleteFilter={filterId => dispatch(deleteFilter({ id: filterId }))}
              />
            </SimpleBar>
          </Item>
          <Item name="exportButton" />
          <Item name="columnChooserButton" />
        </Toolbar>
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
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toDollarAmountField}
          sortOrder="desc"
        />
        <Column
          dataField={DefiField.APY}
          caption={DefiLabel.APY}
          alignment="left"
          visible={true}
          dataType="number"
          allowHiding={true}
          allowHeaderFiltering={false}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.ApyBase}
          caption={DefiLabel.ApyBase}
          alignment="left"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.APYReward}
          caption={DefiLabel.APYReward}
          alignment="left"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toPercentageField}
        />

        <Column
          dataField={DefiField.ApyBase7d}
          caption={DefiLabel.ApyBase7d}
          alignment="left"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.Il7d}
          caption={DefiLabel.Il7d}
          alignment="left"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.ApyMean30d}
          caption={DefiLabel.ApyMean30d}
          alignment="left"
          visible={true}
          dataType="number"
          allowHiding={true}
          allowHeaderFiltering={false}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.VolumeUsd1d}
          caption={DefiLabel.VolumeUsd1d}
          alignment="left"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toDollarAmountField}
        />

        <Column
          dataField={DefiField.VolumeUsd7d}
          caption={DefiLabel.VolumeUsd7d}
          alignment="left"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toDollarAmountField}
        />
        <Column
          dataField={DefiField.ApyBaseInception}
          caption={DefiLabel.ApyBaseInception}
          alignment="left"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.ApyPct1D}
          caption={DefiLabel.ApyPct1D}
          alignment="left"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.ApyPct7D}
          caption={DefiLabel.ApyPct7D}
          alignment="left"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
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
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.Mu}
          caption={DefiLabel.Mu}
          alignment="left"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toPercentageField}
        />
        <Column
          dataField={DefiField.Count}
          caption={DefiLabel.Count}
          alignment="left"
          visible={false}
          allowHeaderFiltering={false}
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
      </StyledDataGridDef>
    </div>
  );
};
