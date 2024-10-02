/* eslint-disable @typescript-eslint/no-explicit-any */
import DataGridDef, { Column, Export, FilterRow, LoadPanel, Pager, Paging } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import React, { FC, useMemo } from "react";
import { PoolData } from "./Models/PoolData";
import { toDollarAmountField, toPercentageField } from "./helpers";

interface PoolApy {
  totalApy: number;
}

interface ApyData {
  [pool: string]: PoolApy;
}

export interface IPrefilterTokensTable {
  onFilterBuilderOpen: () => void;
  loading: boolean;
  onUpdate: () => void;
  onExport: (e: any) => Promise<void>;
  currentFilter: object | null;
  onCurrentFilterChange: (filter: any) => void;
  dataSource: DataSource<PoolData, string>;
  totalApy: ApyData | null;
}

export const VaultsPoolsTable: FC<IPrefilterTokensTable> = ({ loading, dataSource, onExport, totalApy }) => {
  const datagrid = React.createRef<DataGridDef<PoolData, string>>();
  const allowedPageSizes = useMemo(() => [5, 10, 20, 50], []);

  const calculateSafetyScore = (risks: string[]) => {
    if (!risks || risks.length === 0) return 0;

    let score = 3;

    if (risks.includes("IL_HIGH")) score -= 1;
    if (risks.includes("MCAP_MICRO")) score -= 1;

    return Math.max(score, 0);
  };

  return (
    <div>
      <DataGridDef<PoolData>
        id="defi-tokens-table"
        dataSource={dataSource}
        ref={datagrid}
        allowColumnReordering={true}
        columnAutoWidth={true}
        showRowLines={true}
        showBorders={true}
        onExporting={onExport}
        keyExpr="name">
        <FilterRow visible={true} />
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
          allowHiding={false}
        />
        <Column
          dataField="platformId"
          caption="Platform"
          alignment="left"
          dataType="string"
          allowHiding={false}
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
          dataField="tvl"
          caption="TVL"
          alignment="left"
          dataType="number"
          allowHiding={false}
          customizeText={toDollarAmountField}
        />
        <Column
          caption="Safety"
          alignment="left"
          dataType="string"
          calculateCellValue={data => calculateSafetyScore(data.risks)}
          cellRender={cellData => {
            const safetyScore = cellData.value;

            return (
              <div style={{ display: "flex", alignItems: "flex-end" }}>
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
