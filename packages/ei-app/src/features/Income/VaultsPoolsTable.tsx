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
import React, { FC, MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { Button, styled } from "@mui/material";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { toDollarAmountField, toPercentageField } from "./helpers";
import { VaultsData } from "./Models/VaultsData";
import SimpleBar from "simplebar-react";
import { vaultsFilterBuilderFields } from "./vaultsTableConstants";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { createFilter, deleteFilter, fetchFilters, updateFilter } from "@/libs/redux/Slices/AllTokensTableSlice";
import { descOrderingAfterClick, reconfigureFilterPanelStyles } from "@/common/devextreme-filter";
import { StyledDataGridDef } from "@/features/Income/StyledDataGridDef";
import CustomFilterBuilder, { CustomFilterBuilderRef } from "../Common/DevExpressTable/CustomFilterBuilder";

export interface IPrefilterTokensTable {
  loading: boolean;
  dataSource: DataSource<VaultsData, string>;
  onUpdate: (filteredTokenData: ICoin[]) => void;
  dataGridRef?: MutableRefObject<DataGridDef<VaultsData, string> | null>;
}

const COLUMN_CHOOSER_BUTTON_ID = "vaults-column-chooser-btn";

const ColumnChooserActionButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  minWidth: 200,
  maxHeight: 40,
  height: 32,
  fontWeight: 400,
  borderRadius: 6,
  padding: theme.spacing(0.25, 3),
  backgroundColor: "#219a83",
  color: "#0f172a",
  display: "flex",
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor: "#1c8d74",
  },
  "& .column-chooser-arrow": {
    color: "#0f172a",
  },
}));

export const VaultsPoolsTable: FC<IPrefilterTokensTable> = ({ loading, onUpdate, dataSource, dataGridRef }) => {
  const internalDataGridRef = useRef<DataGridDef<VaultsData, string> | null>(null);
  const datagrid =
    (dataGridRef as MutableRefObject<DataGridDef<VaultsData, string> | null>) ?? internalDataGridRef;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const allowedPageSizes = useMemo(() => [5, 10, 20, 50], []);
  const { filters, deletingFilterStatus, creatingFilterStatus, updatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );
  const dispatch = useAppDispatch();
  const liquidityPoolFilters = useMemo(() => filters.filter(f => f.filterType === "vaults"), [filters]);

  const currentFilterRef = useRef<object[] | null | undefined>(null);
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>(); // we use it only for re-render component
  const filterRef = useRef<CustomFilterBuilderRef>(null);
  const [isColumnChooserOpen, setIsColumnChooserOpen] = useState(false);

  const filterPanelText = useRef<Element | null>(null);

  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

  const onApplyFilter = (filter: string | any[] | (() => any) | null, isExternalFiltering = false) => {
    currentFilterRef.current = filter as object[];

    // Send new information to filter builder
    filterRef.current?.onUpdateFilter(filter || []);

    if (!filter) {
      datagrid.current?.instance.clearFilter();
    } else {
      datagrid.current?.instance.filter(filter);
    }

    if (isExternalFiltering) {
      setCurrentFilter(filter as object[]);
    }
  };

  const onContentReady = () => {
    const filterPanelTextDiv = containerRef.current?.querySelector(".dx-datagrid-filter-panel-text");
    if (filterPanelTextDiv) {
      filterPanelText.current = filterPanelTextDiv;
      filterPanelTextDiv.addEventListener("click", () => {
        if (currentFilterRef.current && currentFilterRef.current.length > 0) {
          filterRef.current?.onOpenBuilder(true);
        }
      });
    }

    reconfigureFilterPanelStyles(containerRef, currentFilterRef.current);
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
      {/*@ts-ignore*/}
      <StyledDataGridDef<VaultsData>
        style={{ pointerEvents: "auto" }}
        id="income_table"
        allowColumnResizing={true}
        columnResizingMode="widget"
        dataSource={dataSource}
        ref={datagrid}
        allowColumnReordering={true}
        columnHidingEnabled={false}
        keyExpr="ID"
        onCellClick={descOrderingAfterClick}
        columnAutoWidth={false}
        showRowLines={true}
        showBorders={true}
        filterBuilder={{
          customOperations: [],
          allowHierarchicalFields: true,
        }}
        filterValue={currentFilterRef.current || []}
        onContentReady={onContentReady}
        filterSyncEnabled={true}
        onFilterValueChange={onApplyFilter}
        onOptionChanged={(e) => {
          // Track ColumnChooser open/close state
          if (e.fullName === "columnChooser.visible" || e.fullName?.includes("columnChooser")) {
            setIsColumnChooserOpen(e.value === true);
          }
        }}>
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
            <SimpleBar style={{ maxHeight: "600px", width: "700px", overflow: "hidden" }}>
              <CustomFilterBuilder
                ref={filterRef}
                filterType="vaults"
                filterBuilderFields={vaultsFilterBuilderFields}
                filterLoading={updatingFilterStatus === "loading" || creatingFilterStatus === "loading"}
                filterDeletingLoading={deletingFilterStatus === "loading"}
                onCreateFilter={filter => dispatch(createFilter(filter))}
                predefinedFilters={liquidityPoolFilters}
                onUpdateFilter={filter => dispatch(updateFilter(filter))}
                onDisableFilter={() => {
                  onApplyFilter(null);
                }}
                onApply={filter => {
                  onApplyFilter(filter, true);
                }}
                filterToAppply={currentFilterRef.current}
                onDeleteFilter={filterId => dispatch(deleteFilter({ id: filterId }))}
              />
            </SimpleBar>
          </Item>
          <Item location="after">
            <ColumnChooserActionButton
              id={COLUMN_CHOOSER_BUTTON_ID}
              variant="contained"
              color="success"
              onClick={() => {
                if (isColumnChooserOpen) {
                  datagrid.current?.instance?.hideColumnChooser();
                } else {
                  datagrid.current?.instance?.showColumnChooser();
                }
              }}>
              <span>COLUMN CHOOSER</span>
              {isColumnChooserOpen ? (
                <KeyboardArrowUpRoundedIcon fontSize="small" className="column-chooser-arrow" />
              ) : (
                <KeyboardArrowDownRoundedIcon fontSize="small" className="column-chooser-arrow" />
              )}
            </ColumnChooserActionButton>
          </Item>
        </Toolbar>
        <ColumnChooser
          height={800}
          enabled={true}
          mode="select">
          <Position
            my="right top"
            at="right bottom"
            of={`#${COLUMN_CHOOSER_BUTTON_ID}`}
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
            const totalApy = data.breakdowns?.totalApy ?? 0;
            if (totalApy === "Infinity" || totalApy === Infinity) {
              return Infinity;
            }
            return totalApy * 100;
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
        <Column
          dataField="vaultApy"
          caption="Vault APY"
          alignment="left"
          dataType="number"
          allowHiding={true}
          visible={false}
          allowHeaderFiltering={false}
        />
        <Column
          dataField="beefyPerformanceFee"
          caption="Beefy Performance Fee"
          alignment="left"
          dataType="number"
          allowHiding={true}
          visible={false}
          allowHeaderFiltering={false}
          calculateCellValue={data => {
            const value = data.beefyPerformanceFee;
            if (value === null || value === undefined) return null;
            return value * 100;
          }}
          customizeText={toPercentageField}
        />
        <Column
          dataField="lpFee"
          caption="LP Fee"
          alignment="left"
          dataType="number"
          allowHiding={true}
          visible={false}
          allowHeaderFiltering={false}
          calculateCellValue={data => {
            const value = data.lpFee;
            if (value === null || value === undefined) return null;
            return value * 100;
          }}
          customizeText={toPercentageField}
        />
        <Column
          dataField="tradingApr"
          caption="Trading APR"
          alignment="left"
          dataType="number"
          allowHiding={true}
          visible={false}
          allowHeaderFiltering={false}
          customizeText={toPercentageField}
        />
        <Column
          dataField="strategyTypeId"
          caption="Strategy Type ID"
          alignment="left"
          dataType="string"
          allowHiding={true}
          visible={false}
          headerFilter={{ visible: true }}
        />
        <Column
          dataField="earnedToken"
          caption="Earned Token"
          alignment="left"
          dataType="string"
          allowHiding={true}
          visible={false}
          headerFilter={{ visible: true }}
        />
        <Export
          enabled={true}
          allowExportSelectedData={true}
        />
      </StyledDataGridDef>
    </div>
  );
};
