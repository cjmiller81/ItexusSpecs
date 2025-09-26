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
  Sorting,
  Toolbar,
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { filterBuilderFields, PrefilterTokensField, PrefilterTokensLabel } from "../../constants/PrefilterTokensTable";
import { SymbolCellIdComponent } from "./SymbolCellIdComponent";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { createFilter, deleteFilter, fetchFilters, updateFilter } from "@/libs/redux/Slices/AllTokensTableSlice";
import { descOrderingAfterClick, reconfigureFilterPanelStyles } from "@/common/devextreme-filter";
import SimpleBar from "simplebar-react";
import { ICategory, IExchange, IPlatform } from "components";
import { StyledDataGridDef } from "@/features/Income/StyledDataGridDef";
import CustomFilterBuilder, { CustomFilterBuilderRef } from "../Common/DevExpressTable/CustomFilterBuilder";
import { FilterType } from "components/src/models/token/IPrefilterTokensFilterValues";

export interface IPrefilterTokensTable {
  onCurrentFilterChange: (object?: object[] | null | undefined) => void;
  dataSource: DataSource;
  onSorterChanged: (sorter: any) => void;
  chains: IPlatform[];
  categories: ICategory[];
  exchanges: IExchange[];
  filterType?: string;
}

export const PrefilterTokensTable: FC<IPrefilterTokensTable> = ({
  onCurrentFilterChange,
  dataSource,
  onSorterChanged,
  chains,
  categories,
  exchanges,
  filterType = "market-cap",
}) => {
  const datagrid = React.createRef<DataGridDef<ICoin, string>>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { filters, updatingFilterStatus, deletingFilterStatus, creatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );
  const marketCapFilters = useMemo(() => filters.filter(f => f.filterType === filterType), [filters, filterType]);
  const dispatch = useAppDispatch();
  const filterPanelText = useRef<Element | null>(null);
  const [currentSorter, setCurrentSorter] = useState<any>();
  
  const currentFilterRef = useRef<object[] | null | undefined>(null);
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>(null);
  const filterRef = useRef<CustomFilterBuilderRef>(null);

  useEffect(() => {
    handleOnUpdate();
  }, [currentSorter]);

  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

  const onSortingChanged = e => {
    const sortedColumns = e.component.getDataSource().sort();
    setCurrentSorter(sortedColumns);
  };

  const handleOnUpdate = () => {
    const dataGrid = datagrid?.current?.instance;
    if (!dataGrid) {
      return;
    }

    const gridDataSource = dataGrid.getDataSource();
    const sort = gridDataSource.sort();
    onSorterChanged(sort);
  };

  const categoryToFilterItem = (item): { text: string; value: string } => {
    return {
      text: item.name,
      value: item.category_id,
    };
  };

  const exchangeToFilterItem = (item): { text: string; value: string } => {
    return {
      text: item.name,
      value: item.id,
    };
  };

  const chainsToFilterItem = (item): { text: string; value: string } => {
    return {
      text: item.name,
      value: item.id,
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

  const onApplyFilter = (filter: string | any[] | (() => any) | null, isExternalFiltering = false) => {
    onCurrentFilterChange(filter as object[]);
    currentFilterRef.current = filter as object[];

    // Send new information to filter builder
    filterRef.current?.onUpdateFilter(filter || []);
    
    if (!filter) {
      datagrid.current?.instance.clearFilter();
    }
    else {
      datagrid.current?.instance.filter(filter);
    }

    if (isExternalFiltering) {
      setCurrentFilter(filter as object[]);
    }
  }

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

  return (
    <div
      ref={containerRef}
      style={{ pointerEvents: "auto" }}>
      {/*@ts-ignore*/}
      <StyledDataGridDef<ICoin>
        id="table_header"
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
        dataSource={dataSource}
        allowColumnResizing={true}
        columnResizingMode="widget"
        showBorders={true}
        ref={datagrid}
        width="100%"
        onCellClick={descOrderingAfterClick}
        columnAutoWidth={false}
        allowColumnReordering={true}
        columnHidingEnabled={false}
        filterBuilder={{
          customOperations: [],
          allowHierarchicalFields: true,
        }}
        filterValue={currentFilterRef.current || []}
        onContentReady={onContentReady}
        filterSyncEnabled={true}
        onFilterValueChange={(filter) => onApplyFilter(filter)}>
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
        <Sorting mode="single" />
        <HeaderFilter
          visible={true}
          height={650}>
          <Search enabled={false} />
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
        <Toolbar>
          <Item location="before">
            <SimpleBar style={{ maxHeight: "600px", width: "700px", overflow: "hidden" }}>
              <CustomFilterBuilder 
                ref={filterRef}
                filterType={filterType as FilterType}
                filterBuilderFields={filterBuilderFields}
                filterLoading={updatingFilterStatus === "loading" || creatingFilterStatus === "loading"}
                filterDeletingLoading={deletingFilterStatus === "loading"}
                onCreateFilter={filter => dispatch(createFilter(filter))}
                predefinedFilters={marketCapFilters}
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
          <Item name="columnChooserButton" />
        </Toolbar>

        <Column
          dataField={PrefilterTokensField.Symbol}
          caption={PrefilterTokensLabel.Symbol}
          alignment="left"
          visible={true}
          minWidth={95}
          allowHiding={false}
          allowHeaderFiltering={false}
          cellComponent={SymbolCellIdComponent}
        />
        <Column
          dataField={PrefilterTokensField.Price}
          caption={PrefilterTokensLabel.Price}
          alignment="left"
          visible={true}
          dataType="number"
          minWidth={175}
          allowHeaderFiltering={false}
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
          alignment="left"
          defaultSortOrder="desc"
          visible={true}
          dataType="number"
          minWidth={160}
          allowHeaderFiltering={false}
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
          alignment="left"
          visible={true}
          dataType="number"
          minWidth={160}
          width={170}
          allowHeaderFiltering={false}
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
          alignment="left"
          visible={true}
          dataType="number"
          minWidth={87}
          allowHeaderFiltering={false}
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
          alignment="left"
          visible={true}
          dataType="number"
          minWidth={130}
          allowHeaderFiltering={false}
          customizeText={(cellInfo: any) =>
            (cellInfo.value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0, minimumFractionDigits: 0 })
          }
        />
        <Column
          dataField={PrefilterTokensField.IsErc20}
          caption={PrefilterTokensLabel.IsErc20}
          alignment="center"
          visible={false}
          dataType="boolean"
          minWidth={110}
        />
        <Column
          dataField={PrefilterTokensField.Categories}
          caption={PrefilterTokensLabel.Categories}
          alignment="left"
          visible={true}
          dataType="string"
          calculateFilterExpression={calculateFilterExpression}
          minWidth={150}
          width={210}>
          <HeaderFilter
            visible={true}
            height={650}
            dataSource={{
              store: {
                type: "array",
                data: categories,
              },
              map: categoryToFilterItem,
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
          dataField={PrefilterTokensField.Chains}
          caption={PrefilterTokensLabel.Chains}
          alignment="left"
          visible={true}
          dataType="string"
          calculateFilterExpression={calculateFilterExpression}
          minWidth={150}
          width={210}
          allowHiding={true}>
          <HeaderFilter
            visible={true}
            dataSource={{
              store: {
                type: "array",
                data: chains,
              },
              map: chainsToFilterItem,
            }}
            search={{
              enabled: true,
              mode: "contains",
              searchExpr: ["name"],
            }}
            height={650}>
            <Search enabled={true} />
          </HeaderFilter>
        </Column>
        <Column
          dataField={PrefilterTokensField.Exchanges}
          caption={PrefilterTokensLabel.Exchanges}
          alignment="left"
          visible={true}
          dataType="string"
          calculateFilterExpression={calculateFilterExpression}
          minWidth={150}
          width={190}>
          <HeaderFilter
            height={650}
            visible={true}
            dataSource={{
              store: {
                type: "array",
                data: exchanges,
              },
              map: exchangeToFilterItem,
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
          dataField={PrefilterTokensField.CirculatingSupply}
          caption={PrefilterTokensLabel.CirculatingSupply}
          alignment="right"
          visible={false}
          dataType="number"
          allowHeaderFiltering={false}
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
          allowHeaderFiltering={false}
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
          allowHeaderFiltering={false}
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
      </StyledDataGridDef>
    </div>
  );
};
