import { MenuItem, Select } from "@mui/material";
import { Box, Stack, styled, useTheme } from "@mui/system";
import dynamic from "next/dynamic";
import CoinBaseSvg from "public/coinbase.svg"
import { FC } from "react";
import { DashboardTile, DashboardTileProps } from "./DashboardTile";
const SymbolOverviewNoSSR = dynamic(() => import("react-ts-tradingview-widgets").then(w => w.AdvancedRealTimeChart), {
  ssr: false,
});
const TickerTapeNoSSR = dynamic(() => import("react-ts-tradingview-widgets").then(w => w.TickerTape), {
  ssr: false,
});
type Props = Omit<DashboardTileProps, "children"> & {};

export const TradingViewTile: FC<Props> = ({ title, icon, ...props }) => {
  const theme = useTheme();
  const mode = theme.palette.mode === "dark" ? "dark" : "light";
  return (
    <DashboardTile
      afterTitleComponent={
        <VerySmallSelect value="Coinbase"
          variant="outlined"
          size="small"
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}>
          <MenuItem value={"Coinbase"}>
          <Stack direction="row" gap={0.5} alignItems="center">
            <CoinBaseSvg width={"12px"} height={"12px"}/>
            {"Coinbase"}
          </Stack>
          </MenuItem>
        </VerySmallSelect>
      }
      title={title}
      icon={icon}
      {...props}>
      <Box
        sx={{
          div: {
            "& #widget-ticker-tape-container": {
              color: "red !important",
            },
            body: {
              border: "2px solid red",
            },
          },
        }}>
        <TickerTapeNoSSR
          symbols={[
            {
              proName: "BITSTAMP:BTCUSD",
              title: "BTC/USD",
            },
            {
              proName: "BITSTAMP:ETHUSD",
              title: "ETH/USD",
            },
            {
              proName: "FOREXCOM:SOLUSD",
              title: "SOL/USD",
            },
            {
              proName: "FOREXCOM:ADAUSD",
              title: "ADA/USD",
            },
            {
              proName: "FOREXCOM:DOGEUSD",
              title: "DOGE/USD",
            },
          ]}
          copyrightStyles={{
            parent: {
              display: "none",
            },
          }}
          colorTheme={mode}></TickerTapeNoSSR>
        <SymbolOverviewNoSSR
          enabled_features={[]}
          style="1"
          symbol="BTC/USD"
          height="543px"
          width={"100%"}
          copyrightStyles={{
            parent: {
              display: "none",
            },
          }}
          theme={mode === "light" ? "light" : "dark"}></SymbolOverviewNoSSR>
      </Box>
    </DashboardTile>
  );
};

const VerySmallSelect = styled(Select)(({ theme }) => ({
  width: "130px",
  fontSize: "12px",
  "& .MuiSelect-root": {},
  "& .MuiSelect-select": {
    padding: "2px 4px",
    minHeight: "0px",
  },
  "& .MuiSelect-nativeInput": {},
  "& .MuiSelect-icon": {},
}));
