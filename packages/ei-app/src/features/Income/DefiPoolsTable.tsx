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
}

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
}) => {
  const internalDataGridRef = useRef<DataGridDef<PoolData, string> | null>(null);
  const datagrid = (dataGridRef as MutableRefObject<DataGridDef<PoolData, string> | null>) ?? internalDataGridRef;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { filters, deletingFilterStatus, creatingFilterStatus, updatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );
  const dispatch = useAppDispatch();
  
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>();
  const filterRef = useRef<CustomFilterBuilderRef>(null);
  const liquidityPoolFilters = useMemo(() => filters.filter(f => f.filterType === "liquidity-pool"), [filters]);
  const allowedPageSizes = useMemo(() => [5, 10, 20, 50], []);
  const filterPanelText = useRef<Element | null>(null);

  const stringToFilterItem = (item: string): { text: string; value: string } => {
    return {
      text: item,
      value: item,
    };
  };

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
      onFilterValueChange?.(value);
    },
    [onFilterValueChange],
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
                }}
                filterToAppply={currentFilter}
                onApply={value => onApplyFilter(value)}
                onDeleteFilter={filterId => dispatch(deleteFilter({ id: filterId }))}
              />
            </SimpleBar>
          </Item>
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
          calculateFilterExpression={calculateFilterExpression}>
          <HeaderFilter
            visible={true}
            height={650}
            dataSource={{
              store: {
                type: "array",
                data: symbols,
              },
              map: stringToFilterItem,
            }}
            search={{
              enabled: true,
              mode: "contains",
              searchExpr: ["value"],
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
                data: projects,
              },
              map: stringToFilterItem,
            }}
            search={{
              enabled: true,
              mode: "contains",
              searchExpr: ["value"],
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
                data: chains,
              },
              map: stringToFilterItem,
            }}
            search={{
              enabled: true,
              mode: "contains",
              searchExpr: ["value"],
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
            visible={true}
            height={650}
            dataSource={{
              store: {
                type: "array",
                data: categories,
              },
              map: stringToFilterItem,
            }}
            search={{
              enabled: true,
              mode: "contains",
              searchExpr: ["value"],
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
