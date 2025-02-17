import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import i18next, { t } from "i18next";
import { Typography, Button, Select, MenuItem } from "@mui/material";
import { PositionAllocation } from "@/models/Wallet/PositionAllocation";
import { darken } from "@mui/material/styles";

i18next.setDefaultNamespace("ColumnsDefs");

export const getIndexPositionTableColumns = (
  selectedExchanges?: { [key: number]: string },
  handleExchangeChange?: (event: any, id) => void,
  onConfirmSend?: (row: PositionAllocation) => void
): GridColDef<PositionAllocation>[] => {
  return [
    {
      field: "symbol",
      headerName: t("Symbol"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionAllocation, any, any>) => (
        <Typography
          variant="body1"
          sx={{ textTransform: "uppercase", fontSize: "0.80rem" }}>
          {params.row.symbol}
        </Typography>
      ),
    },

    {
      field: "chain",
      headerName: t("Chain"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: () => (
        <div style={{ display: "flex", width: "100%" }}>
          <Select
            displayEmpty
            renderValue={(selected) =>
              !selected ? (
                <Typography sx={{ fontSize: "0.8rem" }}>{t("SelectChain")}</Typography>
              ) : (
                selected as string
              )
            }
            sx={{
              fontSize: "0.8rem",
              minWidth: "100%",
              maxWidth: "100%",
              height: "36px", 
              backgroundColor: "#474A51",
              borderRadius: "8px",
              border: "none",
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}>
            <MenuItem value="" disabled>
            </MenuItem>
          </Select>
        </div>
      )
    },

    {
      field: "qty",
      headerName: t("Qty"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        if (!params.row.qty) return "--";
        return params.row.qty.toLocaleString("en-US", {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4,
        });
      },
      renderCell: (params: GridRenderCellParams<PositionAllocation, any, any>) => (
        <Typography
          variant="body2"
          sx={{ fontSize: "0.80rem" }}>
          {params.formattedValue}
        </Typography>
      ),
    },

    {
      field: "swapFor",
      headerName: t("Swap For"),
      sortable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: () => (
        <div style={{ display: "flex", width: "100%" }}>
          <Select
            displayEmpty
            renderValue={(selected) =>
              !selected ? (
                <Typography sx={{ fontSize: "0.8rem" }}>{t("SelectToken")}</Typography>
              ) : (
                selected as string
              )
            }
            sx={{
              fontSize: "0.8rem",
              minWidth: "100%",
              maxWidth: "100%",
              height: "36px", 
              backgroundColor: "#474A51",
              borderRadius: "8px",
              border: "none",
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}>
            <MenuItem value="" disabled>
            </MenuItem>
          </Select>
        </div>
      ),
    },
    

    {
      field: "estGasFees",
      headerName: t("EstGasFees"),
      sortable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: () => (
        <Typography variant="body2" sx={{ fontSize: "0.80rem", }}>
          --
        </Typography>
      ),
    },

    {
      field: "estTotal",
      headerName: t("EstTotal"),
      sortable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: () => (
        <Typography variant="body2" sx={{ fontSize: "0.80rem",}}>
          --
        </Typography>
      ),
    },

    {
      field: "slippageTolerance",
      headerName: t("SlippageTolerance"),
      sortable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: () => (
        <Typography variant="body2" sx={{ fontSize: "0.80rem", }}>
          0.5%
        </Typography>
      ),
    },

    {
      field: "action",
      headerName: t("Action"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionAllocation, any, any>) => {
        const action = params.row.action;
        const isBuyAction = action === "Buy";
        const buttonHoverColor = isBuyAction ? "#66c466" : darken("#f44336", 0.2);

        return (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#53ec53",
              color: "black",
              "&:hover": {
                backgroundColor: buttonHoverColor,
              },
              width: "75px",
              height: "30px",
              textTransform: "none",
            }}
            onClick={() => onConfirmSend?.(params.row)}>
            {t("Send")}
          </Button>
        );
      },
    },

    {
      field: "exchanges",
      headerName: "Exchanges",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: params => {
        const rowId = params.row.id;
        return (
          <Select
            value={selectedExchanges?.[rowId] || "Kraken"}
            onChange={e => handleExchangeChange?.(e, rowId)}
            sx={{
              fontSize: "0.8rem",
              width: "85%",
              border: "none",
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}>
            <MenuItem value="Kraken">Kraken</MenuItem>
          </Select>
        );
      },
    },

  ];
};
