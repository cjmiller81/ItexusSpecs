import React from "react";
import { IManagedOrder } from "../types";
import { Box, Collapse, createTheme, IconButton, Table, TableBody, TableCell, TableHead, TableRow, ThemeProvider, Typography } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from "react-i18next";

export function ManagedOrderRow(props: { row: IManagedOrder }) {
    const { t } = useTranslation(["UserDetailsSection", "ColumnsDefs"]);
    const { row } = props;
    const [open, setOpen] = React.useState(true);

    const detailsColumns = [
      { id: 'symbol', label: 'Symbol' },
      { id: 'side', label: 'Side' },
      { id: 'qtyPlaced', label: 'QtyPlaced' },
      { id: 'qtyFilled', label: 'QtyFilled' },
      { id: 'limitPrice', label: 'LimitPrice' },
      { id: 'avgFillPrice', label: 'AvgFillPrice' },
    ];

    const getSectionName = (detailRow: IManagedOrder) => {
      if (!detailRow.legs || detailRow.legs.length == 0) {
        return '';
      }

      return row.legs[0].marketAssetType === "Option" || row.legs[0].marketAssetType === "FutureOption" 
        ? "Option Legs" 
        : row.legs[0]?.marketAssetType;
    }

    const theme = createTheme({
      components: {
        MuiTableCell: {
          styleOverrides: {
            root: {
             fontFamily: "Roboto, Helvetica, Arial, sans-serif",
             fontWeight: 400,
             fontSize: "0.75rem",
             lineHeight: 1.43,
             letterSpacing: "0.01071em",
             display: "table-cell",
             verticalAlign: "inherit",
             borderBottom: "1px solid rgba(224, 224, 224, 1)",
             textAlign: "left",
             paddingTop: "6px",
             paddingBottom: "6px",
             paddingLeft: "16px",
             paddingRight: "16px",
             color: "rgba(0, 0, 0, 0.87)"
            },
          },
        }
      }
    });
  
    return (
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' }}}>
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}>
                 {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
              {(new Date(row.timeLastUpdated.seconds * 1000)).toLocaleString()}
            </TableCell>
            <TableCell>{row.marketSymbol}</TableCell>
            <TableCell>{row.orderType}</TableCell>
            <TableCell>{row.qtyPlaced}</TableCell>
            <TableCell>{row.qtyFilled}</TableCell>
            <TableCell>{row.hasPriceLimit ? row.priceLimit : "-"}</TableCell>
            <TableCell>{row.hasPriceAverageFill ? row.priceAverageFill : "-"}</TableCell>
            <TableCell>{row.exchangeOrderId}</TableCell>
            <TableCell>{row.orderStatus}</TableCell>
            <TableCell>{row.source.includes("TradingPlatform.Tastytrade") ? "Bot" : "Manual"}</TableCell>
            <TableCell>{row.rejectReason}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={12}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="subtitle2" component="div">
                    {getSectionName(row)}
                  </Typography>
                 <Table size="small" aria-label="purchases" 
                   sx={{
                     marginTop: 1,
                     border: "1px solid rgba(0, 0, 0, 0.12)", 
                     borderRadius: "5px", 
                     borderCollapse: "separate" 
                    }}>
                    <TableHead>
                     <TableRow>
                       {detailsColumns.map((column) => (
                        <TableCell key={column.id} sx={{ fontWeight: 'bold' }}>{t(column.label)}</TableCell>
                        ))}
                     </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.legs.map((leg) => (
                        <TableRow key={leg.marketSymbol}>
                          <TableCell component="th" scope="row">{leg.marketSymbol.split(' ').pop()}</TableCell>
                          <TableCell>{leg.instruction}</TableCell>
                          <TableCell>{leg.qtyPlaced}</TableCell>
                          <TableCell>{leg.qtyFilled}</TableCell>
                          <TableCell>{leg.hasPriceLimit ? leg.priceLimit : "-"}</TableCell>
                          <TableCell>{leg.hasPriceAverageFill ? leg.priceAverageFill : "-"} </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                 </Table>
               </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      </ThemeProvider>
    );
}