import i18next from "@/libs/i18n/i18n";
import { GridActionsCellItem, GridColDef, GridRowId, GridRowParams } from "@mui/x-data-grid"
import { Bot } from "./bot";
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import CancelIcon from "@mui/icons-material/Close";

export function getBotColumnsDefs(
  handleStartStopClick: (id: GridRowId) => void,
  handleDeleteBotClick: (id: GridRowId) => void,
) {
  const columns: GridColDef<Bot>[] = [
    {
      field: "active",
      headerName: i18next.t("Active", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "boolean",
      flex: 1,
    },
    {
      field: "atrPeriod",
      headerName: i18next.t("AtrPeriod", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "capitalAllocation",
      headerName: i18next.t("CapitalAllocation", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "entryOrderId",
      headerName: i18next.t("EntryOrderId", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "entryOrderStatus",
      headerName: i18next.t("EntryOrderStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "exchange",
      headerName: i18next.t("Exchange", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "exchangeAccountNumber",
      headerName: i18next.t("ExchangeAccountNumber", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "masterSymbol",
      headerName: i18next.t("MasterSymbol", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "masterSymbolAssetType",
      headerName: i18next.t("MasterSymbolAssetType", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "stopOrderId",
      headerName: i18next.t("StopOrderId", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "stopOrderStatus",
      headerName: i18next.t("StopOrderStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "targetOrderId",
      headerName: i18next.t("TargetOrderId", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "targetOrderStatus",
      headerName: i18next.t("TargetOrderStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "tradeQty.units",
      headerName: i18next.t("TradeQtyUnits", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tradeQty.nanos",
      headerName: i18next.t("TradeQtyNanos", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tradeSymbol",
      headerName: i18next.t("TradeSymbol", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "tradeSymbolAssetType",
      headerName: i18next.t("TradeSymbolAssetType", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "userId",
      headerName: i18next.t("UserId", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      cellClassName: "actions",
      getActions: ({ row }: GridRowParams<Bot>) => {
        return [
          <GridActionsCellItem
            key="save"
            icon={<PlayCircleFilledWhiteOutlinedIcon />}
            label={i18next.t("StartStop", { ns: "Common" })}
            sx={{
              color: "primary.main",
            }}
            onClick={() => handleStartStopClick(row.userId)}
          />,
          <GridActionsCellItem
            key="cancel"
            icon={<CancelIcon />}
            label={i18next.t("Cancel", { ns: "Common" })}
            className="textPrimary"
            onClick={() => handleDeleteBotClick(row.userId)}
            color="inherit"
          />
        ];
      },
    },
  ];

  return columns;
}
