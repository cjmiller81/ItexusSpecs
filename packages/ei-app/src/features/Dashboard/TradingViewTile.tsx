import { Box, useTheme } from "@mui/system"
import dynamic from "next/dynamic"
import React, { FC } from "react"
import { DashboardTile, DashboardTileProps } from "./DashboardTile"
const SymbolOverviewNoSSR = dynamic(() => import("react-ts-tradingview-widgets").then(w => w.AdvancedRealTimeChart), {
  ssr: false,
})
const TickerTapeNoSSR = dynamic(() => import("react-ts-tradingview-widgets").then(w => w.TickerTape), {
  ssr: false,
})
type Props = Omit<DashboardTileProps, "children"> & {}

export const TradingViewTile: FC<Props> = ({ title, icon, ...props }) => {
  const theme = useTheme()
  const mode = theme.palette.mode === "dark" ? "dark" : "light"
  return (
    <DashboardTile
      title={title}
      icon={icon}
      {...props}>
      <Box>
        <MemoizedTickerTapeNoSSR
          displayMode="regular"
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
          colorTheme={mode}
        />
        <MemoizedSymbolOverviewNoSSR
          enabled_features={
            [
              "hide_left_toolbar_by_default",
              "header_widget",
              "header_interval_dialog_button",
              "hide_last_na_study_output",
              "dont_show_boolean_study_arguments",
            ] as any
          }
          disabled_features={[
            "timeframes_toolbar",
            "volume_force_overlay",
            "symbol_search_hot_key",
            "header_indicators",
            "header_settings",
            "legend_context_menu",
            "header_compare",
            "delete_button_in_legend",
            "format_button_in_legend",
            "display_market_status",
            "header_saveload",
            "header_undo_redo",
            "go_to_date",
            "header_widget",
            "timeframes_toolbar",
            "symbol_info",
            "legend_context_menu",
            "volume_force_overlay",
            "left_toolbar",
            "control_bar",
            "seconds_resolution",
            "create_volume_indicator_by_default",
            "create_volume_indicator_by_default_once",
            "compare_symbol",
          ]}
          style="1"
          symbol="COINBASE:BTCUSD"
          height="570px"
          width={"100%"}
          copyrightStyles={{
            parent: {
              display: "none",
            },
          }}
          theme={mode === "light" ? "light" : "dark"}
        />
      </Box>
    </DashboardTile>
  )
}

const MemoizedTickerTapeNoSSR = React.memo(TickerTapeNoSSR, (prevProps, nextProps) => {
  return prevProps.colorTheme === nextProps.colorTheme
})

const MemoizedSymbolOverviewNoSSR = React.memo(SymbolOverviewNoSSR, (prevProps, nextProps) => {
  return prevProps.theme === nextProps.theme
})
