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
import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { toDollarAmountField, toPercentageField } from "./helpers";
import { PoolData } from "./Models/PoolData";

export interface IPrefilterTokensTable {
  loading: boolean;
  onCurrentFilterChange: (object?: object[] | null | undefined) => void;
  currentFilter?: object[] | null | undefined;
  dataSource: DataSource<PoolData, string>;
  onFilterBuilderOpen: Function;
  onUpdate: (filteredTokenData: ICoin[]) => void;
  onExport: (e: ExportingEvent<PoolData, any>) => void;
}

export const VaultsPoolsTable: FC<IPrefilterTokensTable> = ({
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

  const calculateSafetyScore = (risks: string[]) => {
    if (!risks || risks.length === 0) return 0;

    let score = 3;

    if (risks.includes("IL_HIGH")) score -= 1;
    if (risks.includes("MCAP_MICRO")) score -= 1;

    return Math.max(score, 0);
  };

  return (
    <div ref={containerRef}>
      <DataGridDef<PoolData>
        id="defi-tokens-table"
        dataSource={dataSource}
        ref={datagrid}
        allowColumnReordering={true}
        columnHidingEnabled={false}
        keyExpr="ID"
        columnAutoWidth={true}
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
          customizeText={toDollarAmountField}
        />
        <Column
          dataField="apy"
          caption="APY"
          alignment="left"
          dataType="number"
          allowHiding={false}
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
