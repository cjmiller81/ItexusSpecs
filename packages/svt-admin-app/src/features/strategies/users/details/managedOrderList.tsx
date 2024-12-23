import React from "react";
import { IManagedOrder } from "../types";
import {
  Box,
  Collapse,
  createTheme,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  Tooltip,
  TooltipProps,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/system";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";

enum ThemeMode {
  DARK = "dark",
}

export function ManagedOrderRow(props: { row: IManagedOrder }) {
  const { t } = useTranslation(["UserDetailsSection", "ColumnsDefs"]);
  const { row } = props;
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();

  const borderColor =
    theme.palette.mode !== ThemeMode.DARK
      ? "0.1px solid rgba(81, 81, 81, 1) !important"
      : "0.1px solid rgba(224, 224, 224, 1) !important";

  const tableStyle = {
    border: borderColor,
    borderCollapse: "collapse",
  };

  const NoMaxWidthTooltip = styled(
    ({
      className,
      children,
      ...props
    }: TooltipProps & {
      children: React.ReactNode;
    }) => (
      <Tooltip
        {...props}
        classes={{ popper: className }}>
        {children}
      </Tooltip>
    ),
  )({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: "none",
    },
  });

  const detailsColumns = [
    { id: "symbol", label: "Symbol" },
    { id: "side", label: "Side" },
    { id: "qtyPlaced", label: "QtyPlaced" },
    { id: "qtyFilled", label: "QtyFilled" },
    { id: "limitPrice", label: "LimitPrice" },
    { id: "avgFillPrice", label: "AvgFillPrice" },
  ];

  const themeConfig = createTheme({
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
            borderBottom:
              theme.palette.mode === ThemeMode.DARK
                ? "0.1px solid rgba(81, 81, 81, 1)"
                : "0.1px solid rgba(224, 224, 224, 1)",
            textAlign: "left",
            paddingTop: "6px",
            paddingBottom: "6px",
            paddingLeft: "16px",
            paddingRight: "16px",
            color: theme.palette.text.primary,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={themeConfig}>
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" }, backgroundColor: "grey" }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}>
              {open ? (
                <KeyboardArrowUpIcon
                  sx={{
                    color: theme.palette.mode !== ThemeMode.DARK ? "rgba(81, 81, 81, 1)" : "rgba(224, 224, 224, 1)",
                  }}
                />
              ) : (
                <KeyboardArrowDownIcon
                  sx={{
                    color: theme.palette.mode !== ThemeMode.DARK ? "rgba(81, 81, 81, 1)" : "rgba(224, 224, 224, 1)",
                  }}
                />
              )}
            </IconButton>
          </TableCell>

          <TableCell
            component="th"
            scope="row"
            sx={{
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            {new Date(row.timeLastUpdated.seconds * 1000).toLocaleString()}
          </TableCell>
          <TableCell
            sx={{
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            {row.marketSymbol}
          </TableCell>
          <TableCell
            sx={{
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            {row.orderType}
          </TableCell>
          <TableCell
            sx={{
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            {row.qtyPlaced}
          </TableCell>
          <TableCell
            sx={{
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            {row.qtyFilled}
          </TableCell>
          <TableCell
            sx={{
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            {row.hasPriceLimit ? row.priceLimit : "-"}
          </TableCell>
          <TableCell
            sx={{
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            {row.hasPriceAverageFill ? row.priceAverageFill : "-"}
          </TableCell>
          <TableCell
            sx={{
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            {row.exchangeOrderId}
          </TableCell>
          <TableCell
            sx={{
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            {row.orderStatus}
          </TableCell>
          <TableCell
            sx={{
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            {row.source.includes("TradingPlatform.Tastytrade") ? "Bot" : "Manual"}
          </TableCell>
          <TableCell
            sx={{
              maxWidth: "170px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
              boxShadow: `-0.3px 0px 0px 0.3px ${theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[50]}`,
            }}>
            <NoMaxWidthTooltip
              title={row.rejectReason || ""}
              arrow
              sx={{
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "#f0dc9d !important",
                  color: "black",
                  whiteSpace: "nowrap",
                  maxWidth: "none",
                },
              }}>
              <span>{row.rejectReason}</span>
            </NoMaxWidthTooltip>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={12}>
            <Collapse
              in={open}
              timeout="auto"
              unmountOnExit>
              <Box sx={{ display: "flex", alignItems: "flex-start", margin: 1 }}>
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ marginRight: 3, fontSize: "16px", fontWeight: "500" }}>
                  {row.legs &&
                  row.legs.length > 0 &&
                  (row.legs[0].marketAssetType === "Option" || row.legs[0].marketAssetType === "FutureOption")
                    ? "Option Legs"
                    : row.legs[0].marketSymbol}
                </Typography>
                <Box sx={{ maxWidth: "500px" }}>
                  <Table
                    size="small"
                    aria-label="purchases"
                    sx={{
                      ...tableStyle,
                      borderRadius: "10px",
                      flex: 1,
                    }}>
                    <TableHead>
                      <TableRow>
                        {detailsColumns.map(column => (
                          <TableCell
                            key={column.id}
                            sx={tableStyle}>
                            {t(column.label)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.legs.map(leg => (
                        <TableRow key={leg.marketSymbol}>
                          <TableCell
                            sx={tableStyle}
                            component="th"
                            scope="row">
                            {leg.marketSymbol.split(" ").pop()}
                          </TableCell>
                          <TableCell sx={tableStyle}>{leg.instruction}</TableCell>
                          <TableCell sx={tableStyle}>{leg.qtyPlaced}</TableCell>
                          <TableCell sx={tableStyle}>{leg.qtyFilled}</TableCell>
                          <TableCell sx={tableStyle}>{leg.hasPriceLimit ? leg.priceLimit : "-"}</TableCell>
                          <TableCell sx={tableStyle}>{leg.hasPriceAverageFill ? leg.priceAverageFill : "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    </ThemeProvider>
  );
}
