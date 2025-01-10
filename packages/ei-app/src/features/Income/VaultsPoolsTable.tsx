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
import { toDollarAmountField, toPercentageField } from "./helpers";
import { VaultsData } from "./Models/VaultsData";
import SimpleBar from "simplebar-react";
import { CustomFilterBuilder } from "../Common/DevExpressTable/CustomFilterBuilder";
import { vaultsFilterBuilderFields } from "./vaultsTableConstants";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { createFilter, deleteFilter, fetchFilters, updateFilter } from "@/libs/redux/Slices/AllTokensTableSlice";
import { descOrderingAfterClick, reconfigureFilterPanelStyles } from "@/common/devextreme-filter";

export interface IPrefilterTokensTable {
  loading: boolean;
  dataSource: DataSource<VaultsData, string>;
  onUpdate: (filteredTokenData: ICoin[]) => void;
  onExport: (e: ExportingEvent<VaultsData, any>) => void;
}

export const VaultsPoolsTable: FC<IPrefilterTokensTable> = ({ loading, onUpdate, dataSource, onExport }) => {
  const datagrid = React.createRef<DataGridDef<VaultsData, string>>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const allowedPageSizes = useMemo(() => [5, 10, 20, 50], []);
  const [filterBuilderOpen, setFilterBuilderOpen] = useState<boolean>(false);
  const { filters, deletingFilterStatus, creatingFilterStatus, updatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );
  const dispatch = useAppDispatch();
  const liquidityPoolFilters = useMemo(() => filters.filter(f => f.filterType === "vaults"), [filters]);
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>();
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

  useEffect(() => {
    const grid = datagrid?.current?.instance;
    if (!grid) return;
  }, [currentFilter, datagrid]);

  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

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

  const calculateSafetyScore = (risks: string[]) => {
    if (!risks || risks.length === 0) return 0;

    let score = 3;

    if (risks.includes("IL_HIGH")) score -= 1;
    if (risks.includes("MCAP_MICRO")) score -= 1;

    return Math.max(score, 0);
  };

  return (
    <div ref={containerRef}>
      <DataGridDef<VaultsData>
        style={{ pointerEvents: "auto" }}
        id="vaults-tokens-table"
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
        <Toolbar>
          <Item location="before">
            <SimpleBar style={{ maxHeight: "600px" }}>
              <CustomFilterBuilder
                filterType="vaults"
                filterBuilderFields={vaultsFilterBuilderFields}
                filterLoading={updatingFilterStatus === "loading" || creatingFilterStatus === "loading"}
                filterDeletingLoading={deletingFilterStatus === "loading"}
                open={filterBuilderOpen}
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
          dataField="name"
          caption="Name"
          alignment="left"
          dataType="string"
          allowHiding={false}
          headerFilter={{ visible: true }}
        />
        <Column
          dataField="chain"
          caption="Chain"
          alignment="left"
          dataType="string"
          allowHiding={false}
          headerFilter={{ visible: true }}
        />
        <Column
          dataField="boost"
          caption="Boosts"
          alignment="left"
          dataType="string"
          allowHiding={true}
          visible={false}
        />
        <Column
          dataField="platformId"
          caption="Platform"
          alignment="left"
          dataType="string"
          allowHiding={false}
        />
        x{" "}
        <Column
          dataField="tvl"
          caption="TVL"
          alignment="left"
          dataType="number"
          allowHiding={false}
          allowHeaderFiltering={false}
          customizeText={toDollarAmountField}
          sortOrder="desc"
          sortIndex={0}
        />
        <Column
          dataField="apy"
          caption="APY"
          alignment="left"
          dataType="number"
          allowHiding={false}
          allowHeaderFiltering={false}
          calculateCellValue={data => {
            const apyValue = data.totalApy !== undefined ? data.totalApy : data.apy || 0;
            const apyStr = apyValue.toString();
            return apyStr.length > 8 ? apyStr.slice(0, 8) : apyStr;
          }}
          customizeText={toPercentageField}
        />
        <Column
          caption="Safety"
          alignment="left"
          dataType="string"
          calculateCellValue={data => calculateSafetyScore(data.risks)}
          cellRender={cellData => {
            const safetyScore = cellData.value;

            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                }}>
                {[...Array(3)].map((_, index) => {
                  let height;

                  if (index === 2) height = "19px";
                  else if (index === 1) height = "14px";
                  else height = "12px";

                  return (
                    <div
                      key={index}
                      style={{
                        width: "5.4px",
                        height: height,
                        backgroundColor: index < safetyScore ? "green" : "lightgray",
                        marginRight: "2px",
                        margin: "0 1.5px",
                        borderRadius: "1px",
                      }}></div>
                  );
                })}
              </div>
            );
          }}
          allowHiding={false}
        />
        <Export
          enabled={true}
          allowExportSelectedData={true}
        />
      </DataGridDef>
    </div>
  );
};
