import React from "react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Typography, IconButton, Chip, Theme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from "@mui/icons-material/Close";
import { StrategyTableRow, PositionOrderRow } from "@/models/StrategyTableRow";
import i18next from "i18next";

i18next.setDefaultNamespace("ColumnsDefs");

const getTypeTextColor = (type: string, theme: Theme) => {
  return type === "Underlying" ? "#00CED1" :
         type === "Call" ? "#1976d2" :
         type === "Put" ? "#FF8C00" :
         type === "Strangle" ? "#9C27B0" :
         "#666666";
};

const getOrderTypeTextColor = (orderType: string, theme: Theme) => {
  return orderType === "Error" ? theme.palette.error.main :
         orderType === "Filled Entry" ? theme.palette.success.main :
         orderType === "Filled Exit" ? theme.palette.info.main :
         orderType === "Filled Long" ? "#90EE90" :
         orderType === "Filled Short" ? theme.palette.error.main :
         orderType === "Working Entry" ? "#FF8C00" :
         orderType === "Working Target" ? theme.palette.warning.main :
         orderType === "Working Stop" ? theme.palette.error.main :
         theme.palette.text.primary;
};

export const getCallSetListTableColumns = (
  theme: Theme,
  onToggleExpansion: (strategyId: string) => void,
  t: (key: string) => string
): GridColDef[] => {

  return [
    {
      field: "account",
      headerName: "Account #",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      minWidth: 120,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<StrategyTableRow>) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onToggleExpansion(params.row.id)}
            sx={{ 
              color: theme.palette.primary.main,
              padding: 0,
              minWidth: "auto"
            }}
          >
            {params.row.isExpanded ? (
              <ExpandLessIcon sx={{ fontSize: "16px" }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: "16px" }} />
            )}
          </IconButton>
          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
            {params.row.accountNumber}
          </Typography>
        </Box>
      ),
    },
    {
      field: "ticker",
      headerName: "Ticker",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      minWidth: 100,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<StrategyTableRow>) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1976d2 !important" }}>
          {params.row.ticker}
        </Typography>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      minWidth: 100,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<StrategyTableRow>) => {
        const type = params.row.type || "Unknown";
        const textColor = getTypeTextColor(type, theme);
        
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: "0.875rem",
              fontWeight: 600,
              color: `${textColor} !important`
            }}
          >
            {type}
          </Typography>
        );
      },
    },
    {
      field: "dteRange",
      headerName: "DTE Range",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      minWidth: 100,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<StrategyTableRow>) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
          {params.row.dteRange}
        </Typography>
      ),
    },
    {
      field: "entryOffsetPercent",
      headerName: "Entry Offset %",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      minWidth: 120,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<StrategyTableRow>) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: "0.875rem",
            color: (params.row.entryOffsetPercent || 0) >= 0 ? theme.palette.success.main : theme.palette.error.main
          }}
        >
          {(params.row.entryOffsetPercent || 0) > 0 ? '+' : ''}{params.row.entryOffsetPercent || 0}%
        </Typography>
      ),
    },
    {
      field: "entryType",
      headerName: "Entry Type",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      minWidth: 100,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<StrategyTableRow>) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
          {params.row.entryType}
        </Typography>
      ),
    },
    {
      field: "amount",
      headerName: "Amount $",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      minWidth: 100,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<StrategyTableRow>) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
          ${(params.row.amount || 0).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: "errorMsg",
      headerName: "Error Msg",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 2,
      minWidth: 200,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<StrategyTableRow>) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: "0.875rem",
            color: params.row.errorMsg ? theme.palette.error.main : theme.palette.text.secondary,
            wordBreak: "break-word",
            whiteSpace: "normal",
            overflow: "visible",
            textOverflow: "unset",
            lineHeight: 1.2,
            padding: "4px 0"
          }}
        >
          {params.row.errorMsg || "-"}
        </Typography>
      ),
    },
  ];
};

export const getPositionOrdersTableColumns = (
  theme: Theme,
  t: (key: string) => string,
  onCancelOrder?: (orderId: string) => void
): GridColDef[] => {

  return [
    {
      field: "type",
      headerName: "Type",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 0.8,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionOrderRow>) => {
        const type = params.row.type || "Unknown";
        const textColor = getTypeTextColor(type, theme);
        
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: "0.875rem",
              fontWeight: 400,
              color: `${textColor} !important`
            }}
          >
            {type}
          </Typography>
        );
      },
    },
    {
      field: "ticker",
      headerName: "Ticker",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionOrderRow>) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "white !important" }}>
          {params.row.ticker}
        </Typography>
      ),
    },
    {
      field: "originalQty",
      headerName: "Original Qty",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 0.8,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionOrderRow>) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
          {params.row.originalQty || 0}
        </Typography>
      ),
    },
    {
      field: "orderType",
      headerName: "Order Type",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1.2,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionOrderRow>) => {
        const orderType = params.row.orderType || "Unknown";
        const textColor = getOrderTypeTextColor(orderType, theme);
        
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: "0.875rem",
              fontWeight: 400,
              color: `${textColor} !important`
            }}
          >
            {orderType}
          </Typography>
        );
      },
    },
    {
      field: "orderId",
      headerName: "Order Id",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1.2,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionOrderRow>) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem", fontFamily: "monospace" }}>
          {params.row.orderId}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 0.6,
      disableColumnMenu: true,
       renderCell: (params: GridRenderCellParams<PositionOrderRow>) => (
         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
           {(params.row.orderType === "Working Entry" || 
             params.row.orderType === "Working Target" || 
             params.row.orderType === "Working Stop") && onCancelOrder && (
                          <IconButton
                size="small"
                onClick={() => onCancelOrder(params.row.orderId)}
                sx={{ 
                  backgroundColor: theme.palette.error.main,
                  color: "white",
                  padding: 0,
                  minWidth: "auto",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                  }
                }}
              >
                <CloseIcon sx={{ fontSize: "14px" }} />
              </IconButton>
           )}
         </Box>
       ),
    },
    {
      field: "orderQty",
      headerName: "Order Qty",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 0.8,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionOrderRow>) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
          {params.row.orderQty || 0}
        </Typography>
      ),
    },
    {
      field: "avgFillPrice",
      headerName: "Avg Fill Price",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionOrderRow>) => (
        <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
          {(params.row.avgFillPrice || 0) > 0 ? `$${(params.row.avgFillPrice || 0).toFixed(2)}` : "-"}
        </Typography>
      ),
    },
    {
      field: "errorMsg",
      headerName: "Error Msg",
      sortable: false,
      editable: false,
      filterable: false,
      flex: 2,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<PositionOrderRow>) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: "0.875rem",
            color: params.row.errorMsg ? theme.palette.error.main : theme.palette.text.secondary,
            wordBreak: "break-word",
            whiteSpace: "normal",
            overflow: "visible",
            textOverflow: "unset",
            lineHeight: 1.2,
            padding: "4px 0"
          }}
        >
          {params.row.errorMsg || "-"}
        </Typography>
      ),
    },
  ];
};
