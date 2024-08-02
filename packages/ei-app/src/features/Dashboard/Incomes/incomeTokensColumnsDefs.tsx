import { SymbolLookupField } from "@/features/Common/DevExpressTable/SymbolLookupField";
import { toDollarsAmountField } from "@/features/Income/helpers";
import { PoolData } from "@/features/Income/Models/PoolData";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import i18next from "../../../libs/i18n/i18n";

export const getIncomeTokensColumnsDefs = (): GridColDef<PoolData>[] => {
  return [
    {
      field: "symbol",
      headerName: i18next.t("Symbol", { ns: "IncomeTokensColumns" }),
      sortable: false,
      editable: false,
      filterable: false,
      maxWidth: 70,
      disableColumnMenu: true,
      valueFormatter: params => params?.value?.toUpperCase(),
    },
    {
      field: "project",
      headerName: i18next.t("Project", { ns: "IncomeTokensColumns" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
  
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PoolData, any, any>) => {
        const url = `${process.env.LAMA_PROJECT_ICONS_URL}/icons/protocols/${params.row.project}?w=48&h=48`;
        return (
          <SymbolLookupField
            height={22}
            width={22}
            key={params.row.pool}
            text={params.row.project}
            iconUrl={url}
          />
        );
      },
    },
    {
      field: "chain",
      headerName: i18next.t("Chain", { ns: "IncomeTokensColumns" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      maxWidth: 120,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PoolData, any, any>) => {
        const url = `${process.env.LAMA_PROJECT_ICONS_URL}/icons/chains/rsz_${params.row.chain}?w=48&h=48`;
        return (
          <SymbolLookupField
            height={22}
            width={22}
            key={params.row.pool}
            text={params.row.chain}
            iconUrl={url}></SymbolLookupField>
        );
      },
    },
    {
      field: "tvlUsd",
      headerName: i18next.t("TVL", { ns: "IncomeTokensColumns" }),
      sortable: false,
      editable: false,
      filterable: false,
      maxWidth: 70,
      minWidth: 70,
      flex: 1,
      disableColumnMenu: true,
      valueFormatter: params => toDollarsAmountField(params.value),
    },
    {
      field: "apy",
      headerName: i18next.t("APY", { ns: "IncomeTokensColumns" }),
      sortable: false,
      editable: false,
      filterable: false,
      maxWidth: 60,
      disableColumnMenu: true,
      valueFormatter: params => {
        if (!params.value) return "";
        return `${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
      },
    },
  ];
};
