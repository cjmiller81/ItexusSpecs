import { styled } from "@mui/material";
import { BasicTable } from "components";
import React from "react";

interface WalletsTableProps {
  maxHeight?: number | string;
}

export const WalletsTable = styled(
  (props: React.ComponentProps<typeof BasicTable> & WalletsTableProps) => <BasicTable {...props} />
)(({ theme, maxHeight }) => ({
  width: "100%",
  minHeight: "425px",
  mt: 2,
  display: "grid",
  "& .MuiDataGrid-virtualScroller": {
    overflowY: "auto !important",
    backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "transparent",
    /* Modern custom scrollbar */
    scrollbarColor: `${theme.palette.grey[700]} ${theme.palette.background.paper}`,
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "8px",
      background: "transparent",
    },
    "&::-webkit-scrollbar-track": {
      width: "8px",
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.grey[400],
      borderRadius: "8px",
      minHeight: "24px",
      border: `2px solid ${theme.palette.background.paper}`,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: theme.palette.mode === "dark"
        ? theme.palette.grey[600]
        : theme.palette.grey[600],
    },
    "&::-webkit-scrollbar-corner": {
      background: "transparent",
    },
  },
  "& .MuiDataGrid-main": {
    height: "auto",
    maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : "580px",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.mode === "light" ? "#f5f5f5": "transparent",
  },
  "& .MuiDataGrid-footerContainer": {
    height: "40px",
  },
  "& .MuiDataGrid-row": {
    maxHeight: "1000px !important",
  },
  ".MuiDataGrid-cell--withRenderer ": {
    maxHeight: "1000px !important",
  },
  "& .MuiDataGrid-row--editing": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main,
  },
  "& .MuiDataGrid-cell--editing[data-field=walletName]": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.primary.main + '99'
        : theme.palette.primary.main + '33',
  },
  ".MuiDataGrid-withBorderColor": {
    bgColor: "transparent",
  }, 
  // FIX: Prevent horizontal scrollbar on hover
  "& .MuiDataGrid-row:hover": {
    cursor: "pointer",
    backgroundColor: theme.palette.mode === "light" ? "#e3f2fd" : "rgb(26, 123, 104)",
    border: "none !important",
  },
  "& .MuiDataGrid-row:hover .MuiDataGrid-cell": {
    backgroundColor: theme.palette.mode === "light" ? "#219a83" : theme.palette.primary.main + '33',
    border: "none !important",
  },
  "& .unsupported-chain-row": {
    cursor: "not-allowed",
    opacity: 0.6,
  },
  "& .unsupported-chain-row:hover": {
    cursor: "not-allowed",
    backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#2a2a2a",
    border: "none !important",
  },
  "& .unsupported-chain-row:hover .MuiDataGrid-cell": {
    backgroundColor: "transparent",
    border: "none !important",
  },
  "& .selected-row .MuiDataGrid-cell": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-cell": {
    cursor: "pointer",
    userSelect: "none",
  },
}));
