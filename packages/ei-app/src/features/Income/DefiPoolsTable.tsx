/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICoin } from "components/src/models/token/ICoin";
import { createFilter, deleteFilter, updateFilter, fetchFilters } from "@/libs/redux/Slices/AllTokensTableSlice";
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
import React, { FC, MutableRefObject, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChainCell } from "./ChainCell";
import { toDollarAmountField, toPercentageField, toPoolCellField } from "./helpers";
import { PoolData } from "./Models/PoolData";
import { ProjectCellComponent } from "./ProjectCellComponent";
import { DefiField, defiFilterBuilderFields, DefiLabel } from "./tableConstants";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import SimpleBar from "simplebar-react";
import { descOrderingAfterClick, reconfigureFilterPanelStyles } from "@/common/devextreme-filter";
import { StyledDataGridDef } from "@/features/Income/StyledDataGridDef";
import CustomFilterBuilder, { CustomFilterBuilderRef } from "../Common/DevExpressTable/CustomFilterBuilder";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

export interface IPrefilterTokensTable {
  loading: boolean;
  dataSource: DataSource<PoolData, string>;
  onUpdate: (filteredTokenData: ICoin[]) => void;
  dexs: string[];
  chains: string[];
  categories: string[];
  projects: string[];
  symbols: string[];
  onFilterValueChange?: (filter: object[] | null | undefined) => void;
  dataGridRef?: MutableRefObject<DataGridDef<PoolData, string> | null> | RefObject<DataGridDef<PoolData, string>>;
  externalFilter?: object[] | null | undefined;
  onClearCategoryFilter?: () => void;
}

const COLUMN_CHOOSER_BUTTON_ID = "defi-pools-column-chooser-btn";

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
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  "&:hover": {
    backgroundColor: "#1c8d74",
  },
  "& .column-chooser-arrow": {
    color: "#0f172a",
  },
}));

export const DefiPoolsTable: FC<IPrefilterTokensTable> = ({
  loading,
  onUpdate,
  dataSource,
  dexs,
  chains,
  categories,
  projects,
  symbols,
  onFilterValueChange,
  dataGridRef,
  externalFilter,
  onClearCategoryFilter,
}) => {
  const internalDataGridRef = useRef<DataGridDef<PoolData, string> | null>(null);
  const datagrid = (dataGridRef as MutableRefObject<DataGridDef<PoolData, string> | null>) ?? internalDataGridRef;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { filters, deletingFilterStatus, creatingFilterStatus, updatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );
  const dispatch = useAppDispatch();
  
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>();
  const [isColumnChooserOpen, setIsColumnChooserOpen] = useState(false);
  const filterRef = useRef<CustomFilterBuilderRef>(null);
  const liquidityPoolFilters = useMemo(() => filters.filter(f => f.filterType === "liquidity-pool"), [filters]);
  const allowedPageSizes = useMemo(() => [5, 10, 20, 50], []);
  const filterPanelText = useRef<Element | null>(null);
  const categoryHeaderFilterRef = useRef<any>(null);

  useEffect(() => {
    if (datagrid.current?.instance) {
      const filterValue = externalFilter || [];
      datagrid.current.instance.option("filterValue", filterValue);
      datagrid.current.instance.refresh();
    }
    if (externalFilter !== undefined) {
      setCurrentFilter(externalFilter);
    }
  }, [externalFilter, datagrid]);

  const stringToFilterItem = useCallback((item: { name: string }): { text: string; value: string } => {
    return {
      text: item.name,
      value: item.name,
    };
  }, []);

  const categoryHeaderFilterDataSource = useMemo(() => ({
    store: {
      type: "array" as const,
      data: categories.map((cat: string) => ({ name: cat })),
    },
    map: stringToFilterItem,
  }), [categories, stringToFilterItem]);

  const extractCategoryValues = useCallback((filter: any[] | null | undefined): string[] => {
    if (!filter || !Array.isArray(filter)) return [];

    const values: string[] = [];

    const walk = (node: any) => {
      if (!Array.isArray(node)) return;

      if (node.length === 3 && typeof node[0] === "string") {
        const [field, op, value] = node;
        
        if (field === "category" && op === "anyof" && Array.isArray(value)) {
          values.push(...value.filter(v => typeof v === "string"));
          return;
        }
        
        if (field === "category" && (op === "contains" || op === "=")) {
          if (typeof value === "string") {
            values.push(value);
          }
        }
        return;
      }
      
      for (let i = 0; i < node.length; i++) {
        const item = node[i];
        if (item === "or" || item === "and") {
          continue;
        }
        if (Array.isArray(item)) {
          walk(item);
        }
      }
    };

    walk(filter);
    
    return Array.from(new Set(values));
  }, []);

  const activeFilter = useMemo(() => {
    return externalFilter !== undefined ? (externalFilter || []) : (currentFilter || []);
  }, [externalFilter, currentFilter]);

  const selectedCategoryValues = useMemo(() => {
    const values = extractCategoryValues(activeFilter);
    return values;
  }, [activeFilter, extractCategoryValues]);

  const calculateFilterExpression = useCallback(function (
      this: any,
      filterValues: any,
      selectedFilterOperation: string | null,
      _target: string,
    ): any {
      try {
        let column = this;
        if (filterValues) {
          let selectedValue = filterValues;
  
          if (selectedValue && selectedFilterOperation === "=" && column.dataField === "category") {
            return [column.dataField, "=", selectedValue];
          }
  
          if (selectedValue && selectedFilterOperation === "=") {
            return [column.dataField, "contains", selectedValue];
          }
  
          if (selectedFilterOperation === "contains") {
            return [column.dataField, "contains", selectedValue];
          }
  
          if (Array.isArray(selectedValue) && selectedValue.length > 0) {
            return selectedValue.map((value: string) => [column.dataField, "contains", value]);
          }
  
          return column.defaultCalculateFilterExpression.apply(this, arguments);
        }
        return column.defaultCalculateFilterExpression.apply(this, arguments);
      } catch (err) {
        console.error("Error on calculateFilterExpression:", err);
        return null;
      }
    }, []);

  const onApplyFilter = useCallback(
    (filter: string | any[] | (() => any)) => {
      const value = filter as object[];
      setCurrentFilter(value);
      onFilterValueChange?.(null);
      
      if (datagrid.current?.instance) {
        setTimeout(() => {
          try {
            const instance = datagrid.current?.instance;
            if (instance) {
              instance.columnOption("category", {
                headerFilter: {
                  dataSource: categoryHeaderFilterDataSource,
                },
              });
            }
          } catch (error) {
            console.error("[DefiPoolsTable] ❌ Could not restore category HeaderFilter dataSource:", error);
          }
        }, 200);
      }
    },
    [onFilterValueChange, datagrid, categoryHeaderFilterDataSource],
  );



















  
  
  const onContentReady = () => {
    const filterPanelTextDiv = containerRef.current?.querySelector(".dx-datagrid-filter-panel-text");
    if (filterPanelTextDiv) {
      filterPanelText.current = filterPanelTextDiv;
      filterPanelTextDiv.addEventListener("click", () => {
        if (currentFilter && currentFilter.length > 0) {
          filterRef.current?.onOpenBuilder(true);
        }
      });
    }

    reconfigureFilterPanelStyles(containerRef, currentFilter);
  };

  useEffect(() => {
    return () => {
      if (filterPanelText.current) {
        filterPanelText.current.replaceWith(filterPanelText.current.cloneNode(true));
      }
    };
  }, []);

  useEffect(() => {
    const instance = datagrid.current?.instance;
    if (!instance) return;

    try {
      instance.columnOption("category", {
        headerFilter: {
          filterValues: selectedCategoryValues.length > 0 ? selectedCategoryValues : null,
        },
      });
    } catch (error) {
      console.error("[DefiPoolsTable] ❌ Could not update filterValues:", error);
    }
  }, [selectedCategoryValues, datagrid]);

  return (
    <div ref={containerRef}>
      {/*@ts-ignore*/}
      <StyledDataGridDef<PoolData>
        id="income_table"
        dataSource={dataSource}
        allowColumnResizing={true}
        columnResizingMode="widget"
        ref={datagrid}
        loadPanel={{ enabled: false }}
        allowColumnReordering={true}
        columnHidingEnabled={false}
        keyExpr="pool"
        remoteOperations={{ sorting: true, paging: true, filtering: true, search: true }}
        onCellClick={descOrderingAfterClick}
        columnAutoWidth={false}
        showRowLines={true}
        showBorders={true}
        filterBuilder={{
          customOperations: [{ name: "contains", caption: "Contains" }],
          allowHierarchicalFields: true,
        }}
        filterValue={
          externalFilter !== undefined && externalFilter !== null && Array.isArray(externalFilter) && externalFilter.length > 0
            ? externalFilter
            : (currentFilter || [])
        }
        onContentReady={onContentReady}
        filterSyncEnabled={true}
        onFilterValueChange={onApplyFilter}
        onOptionChanged={(e) => {
          const instance = datagrid.current?.instance;
          if (!instance) return;

          const isCategoryHeaderFilterOpened = 
            e.fullName === "columns[category].headerFilter.visible" && 
            e.name === "visible" && 
            e.value === true;

          if (isCategoryHeaderFilterOpened) {
            try {
              instance.columnOption("category", {
                headerFilter: {
                  dataSource: categoryHeaderFilterDataSource,
                },
              });
              
              let attemptCount = 0;
              const maxAttempts = 3;
              const setFilterValues = () => {
                attemptCount++;
                try {
                  instance.columnOption("category", {
                    headerFilter: {
                      dataSource: categoryHeaderFilterDataSource,
                    },
                  });
                  
                  const filterValues = selectedCategoryValues.length > 0 ? selectedCategoryValues : null;
                  instance.columnOption("category", {
                    headerFilter: {
                      filterValues: filterValues,
                    },
                  });
                  
                  if (attemptCount < maxAttempts) {
                    setTimeout(setFilterValues, 150);
                  }
                } catch (error) {
                  console.error("[DefiPoolsTable] ❌ Could not set filterValues (attempt " + attemptCount + "):", error);
                  if (attemptCount < maxAttempts) {
                    setTimeout(setFilterValues, 150);
                  }
                }
              };
              
              setTimeout(setFilterValues, 100);
            } catch (error) {
              console.error("[DefiPoolsTable] ❌ Could not set category HeaderFilter dataSource:", error);
            }
          }

          if (e.fullName === "filterValue" && e.name === "filterValue") {
            setTimeout(() => {
              try {
                instance.columnOption("category", {
                  headerFilter: {
                    dataSource: categoryHeaderFilterDataSource,
                  },
                });
              } catch (error) {
                console.error("[DefiPoolsTable] ❌ Could not ensure category HeaderFilter dataSource:", error);
              }
            }, 150);
          }

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
        <LoadPanel enabled={false} />
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
        <Toolbar>
          <Item location="before">
            <SimpleBar style={{ maxHeight: "600px", width: "700px", overflow: "hidden" }}>
              <CustomFilterBuilder
                ref={filterRef}             
                filterType="liquidity-pool"
                filterBuilderFields={defiFilterBuilderFields}
                filterLoading={updatingFilterStatus === "loading" || creatingFilterStatus === "loading"}
                filterDeletingLoading={deletingFilterStatus === "loading"}
                onCreateFilter={filter => dispatch(createFilter(filter))}
                predefinedFilters={liquidityPoolFilters}
                onUpdateFilter={filter => dispatch(updateFilter(filter))}
                onDisableFilter={() => {
                  setCurrentFilter(null);
                  onFilterValueChange?.(null);
                  filterRef.current?.onUpdateFilter(null);
                  dispatch(fetchFilters({}));
                  onClearCategoryFilter?.();
                }}
                filterToAppply={currentFilter}
                onApply={value => onApplyFilter(value)}
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
        <Column
          dataField={DefiField.Symbol}
          caption={DefiLabel.Symbol}
          alignment="left"
          visible={true}
          dataType="string"
          allowHiding={true}
          cellComponent={toPoolCellField}
          calculateFilterExpression={calculateFilterExpression}>
          <HeaderFilter
            visible={true}
            height={650}
            dataSource={{
              store: {
                type: "array",
                data: symbols.map((sym: string) => ({ name: sym })),
              },
              map: stringToFilterItem,
            }}
            search={{
              enabled: true,
              mode: "contains",
              searchExpr: ["name"],
            }}>
            <Search enabled={true} />
          </HeaderFilter>
        </Column>
        <Column
          dataField={DefiField.Project}
          caption={DefiLabel.Project}
          alignment="left"
          visible={true}
          dataType="string"
          allowHiding={true}
          cellComponent={ProjectCellComponent}
          calculateFilterExpression={calculateFilterExpression}>
          <HeaderFilter
            visible={true}
            height={650}
            dataSource={{
              store: {
                type: "array",
                data: projects.map((proj: string) => ({ name: proj })),
              },
              map: stringToFilterItem,
            }}
            search={{
              enabled: true,
              mode: "contains",
              searchExpr: ["name"],
            }}>
            <Search enabled={true} />
          </HeaderFilter>
        </Column>
        <Column
          dataField={DefiField.Chain}
          caption={DefiLabel.Chain}
          alignment="left"
          visible={true}
          dataType="string"
          allowHiding={true}
          cellComponent={ChainCell}
          calculateFilterExpression={calculateFilterExpression}>
          <HeaderFilter
            visible={true}
            height={650}
            dataSource={{
              store: {
                type: "array",
                data: chains.map((chain: string) => ({ name: chain })),
              },
              map: stringToFilterItem,
            }}
            search={{
              enabled: true,
              mode: "contains",
              searchExpr: ["name"],
            }}>
            <Search enabled={true} />
          </HeaderFilter>
        </Column>
        <Column
          dataField={DefiField.Category}
          caption={DefiLabel.Category}
          alignment="left"
          visible={true}
          dataType="string"
          allowHiding={true}
          calculateFilterExpression={calculateFilterExpression}>
          <HeaderFilter
            ref={categoryHeaderFilterRef}
            visible={true}
            height={650}
            dataSource={categoryHeaderFilterDataSource}
            search={{
              enabled: true,
              mode: "contains",
              searchExpr: ["name"],
            }}>
            <Search enabled={true} />
          </HeaderFilter>
        </Column>
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
          width="auto"
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
          width="auto"
        />
        <Column
          dataField={DefiField.ApyBase}
          caption={DefiLabel.ApyBase}
          alignment="left"
          visible={true}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toPercentageField}
          width="auto"
        />
        <Column
          dataField={DefiField.APYReward}
          caption={DefiLabel.APYReward}
          alignment="left"
          visible={true}
          dataType="number"
          allowHeaderFiltering={false}
          allowHiding={true}
          customizeText={toPercentageField}
          width="auto"
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
          width="auto"
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
        <Column
          dataField={DefiField.IlRisk}
          caption={DefiLabel.IlRisk}
          alignment="left"
          visible={false}
          dataType="string"
          allowHiding={true}
        />
        <Column
          dataField={DefiField.Exposure}
          caption={DefiLabel.Exposure}
          alignment="left"
          visible={false}
          dataType="string"
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
