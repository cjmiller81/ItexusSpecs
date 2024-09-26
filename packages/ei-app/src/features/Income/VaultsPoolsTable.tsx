/* eslint-disable @typescript-eslint/no-explicit-any */
import DataGridDef, { Column, Export, FilterRow, LoadPanel, Pager, Paging } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import { ExportingEvent } from "devextreme/ui/data_grid";
import React, { FC, useMemo } from "react";
import { PoolData } from "./Models/PoolData";
import { toDollarAmountField, toPercentageField } from "./helpers";

export interface IPrefilterTokensTable {
  loading: boolean;
  dataSource: DataSource<PoolData, string>;
  onExport: (e: ExportingEvent<PoolData, any>) => void;
  totalApy: number | null; // Add totalApy to props
}

export const VaultsPoolsTable: FC<IPrefilterTokensTable> = ({ loading, dataSource, onExport, totalApy }) => {
  const datagrid = React.createRef<DataGridDef<PoolData, string>>();
  console.log(totalApy, "TA!!!!!!!!!");
  const allowedPageSizes = useMemo(() => [5, 10, 20, 50], []);

  // Function to calculate safety score based on risks
  const calculateSafetyScore = (risks: string[]) => {
    if (!risks || risks.length === 0) return 0;

    let score = 3; // Default to maximum score

    if (risks.includes("IL_HIGH")) score -= 1;
    if (risks.includes("MCAP_MICRO")) score -= 1;

    return Math.max(score, 0); // Score ranges between 0 and 3
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
          dataField="boost" // This should be the name of the field containing boost info
          caption="Boosts"
          alignment="left"
          dataType="string"
          allowHiding={false}
          cellRender={cellData => {
            const boost = cellData.value; // Get the boost value
            return <span>{boost ? boost.value : "No Boost"}</span>; // Adjust based on your boost structure
          }}
        />
        <Column
          dataField="platformId" // Change this to the correct field based on the API response
          caption="Platform" // Updated column header
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
            // If 'totalApy' is available, use it; otherwise, fall back to individual pool's APY
            return data.apy || totalApy || 0;
          }}
          customizeText={toPercentageField}
        />
        <Column
          caption="Daily"
          alignment="left"
          dataType="number"
          calculateCellValue={data => data.apy / 365}
          customizeText={toPercentageField}
          allowHiding={false}
        />
        <Column
          dataField="tvl"
          caption="TVL"
          alignment="left"
          dataType="number"
          allowHiding={false}
          customizeText={toDollarAmountField}
        />
        {/* Safety Column with Vertical Bars */}
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
