import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { Market } from "@/models/Market";
import i18next, { t } from "i18next";
import moment from "moment";

i18next.setDefaultNamespace("MarketTableColumns");

export const  getMarketTableColumns = (): GridColDef<Market>[] => {
  return [
    {
      field: "date",
      headerName: t("Date"),
      sortable: true,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<Market, any, any>) => (
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.85rem",
            color:"#9E9E9E",
            fontWeight: 'bold'
          }}
        >
           {moment.utc(params.row.date).format("YYYY-MM-DD")}
        </Typography>
      ),
    },

    {
      field: "symbol",
      headerName: t("Symbol"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<Market, any, any>) => (
        <Typography
          variant="body1"
          sx={{ textTransform: "uppercase", fontSize: "0.85rem", color: "#ff9e00", fontWeight: 'bold'}}>
          {params.row.symbol}
        </Typography>
      ),
    },

    {
      field: "bought",
      headerName: t("Bought"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        if (!params.row.bought) return "--";
        return params.row.bought.toLocaleString("en-US", {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        });
      },
      renderCell: (params: GridRenderCellParams<Market, any, any>) => {
        const boughtValue = params.row.bought;
        const soldValue = params.row.sold;
    
        let boughtColor = "#9E9E9E";
        let soldColor = "#9E9E9E";
    
        if (boughtValue > soldValue) {
          boughtColor = "green";
          soldColor = "#9E9E9E";
        } else if (boughtValue < soldValue) {
          boughtColor = "#9E9E9E";
          soldColor = "red"; 
        } else if (boughtValue === soldValue) {
          boughtColor = "#9E9E9E";
          soldColor = "#9E9E9E"; 
        }
    
        return (
          <Typography
            variant="body1"
            sx={{
              fontSize: "0.85rem",
              color: boughtColor,
              fontWeight: "bold",
            }}
          >
            {params.formattedValue}
          </Typography>
        );
      },
    },
    
    {
      field: "sold",
      headerName: t("Sold"),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: params => {
        if (!params.row.sold) return "--";
        return params.row.sold.toLocaleString("en-US", {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        });
      },
      renderCell: (params: GridRenderCellParams<Market, any, any>) => {
        const boughtValue = params.row.bought;
        const soldValue = params.row.sold;
    
        let soldColor = "#9E9E9E";
    
        if (boughtValue > soldValue) {
          soldColor = "#9E9E9E";
        } else if (boughtValue < soldValue) {
          soldColor = "red"; 
        } else if (boughtValue === soldValue) {
          soldColor = "#9E9E9E";
        }
    
        return (
          <Typography
            variant="body1"
            sx={{
              fontSize: "0.85rem",
              color: soldColor,
              fontWeight: "bold",
            }}
          >
            {params.formattedValue}
          </Typography>
        );
      },
    },

      {
        field: "percentAvg",
        headerName: t("%Avg"),
        sortable: false,
        editable: false,
        filterable: false,
        flex: 1,
        disableColumnMenu: true,
        valueGetter: (params) => {
           if (!params.row.percentAvg) return "--";
           return (params.row.percentAvg * 100).toFixed(0);
        },
        renderCell: (params: GridRenderCellParams<Market, any, any>) => (
          <Typography
            variant="body1"
            sx={{ fontSize: "0.85rem", color: "#9E9E9E", fontWeight: 'bold' }}
          >
            {params.formattedValue}%
          </Typography>
        ),
      },

      {
        field: "buyRatio",
        headerName: t("BuyRatio"),
        sortable: false,
        editable: false,
        filterable: false,
        flex: 1,
        disableColumnMenu: true,
        valueGetter: params => {
          if (!params.row.buyRatio) return "--";
          return params.row.buyRatio.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          });
        },
        renderCell: (params: GridRenderCellParams<Market, any, any>) => (
          <Typography
            variant="body1"
            sx={{ fontSize: "0.85rem", color: "#9E9E9E", fontWeight: 'bold' }}
          >
            {params.formattedValue}
          </Typography>
        ),
      },      

      {
        field: "dpIndex",
        headerName: t("DPIndex"),
        sortable: false,
        editable: false,
        filterable: false,
        flex: 1,
        disableColumnMenu: true,
        valueGetter: (params) => {
          if (!params.row.dpIndex) return "--";
           return (params.row.dpIndex * 100).toFixed(0);
        },
        renderCell: (params: GridRenderCellParams<Market, any, any>) => (
          <Typography
            variant="body1"
            sx={{ fontSize: "0.85rem", color: "#9E9E9E", fontWeight: 'bold' }}
          >
            {params.formattedValue}%
          </Typography>
        ),
      },
      
      {
        field: "total",
        headerName: t("Total"),
        sortable: false,
        editable: false,
        filterable: false,
        flex: 1,
        disableColumnMenu: true,
        valueGetter: params => {
          if (!params.row.total) return "--";
          return params.row.total.toLocaleString("en-US", {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          });
        },
        renderCell: (params: GridRenderCellParams<Market, any, any>) => (
          <Typography
            variant="body1"
            sx={{ fontSize: "0.85rem", color:"#9E9E9E", fontWeight: 'bold' }}>
            {params.formattedValue}
          </Typography>
        ),
      }
  ];
};
