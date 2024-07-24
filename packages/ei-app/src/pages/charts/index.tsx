import { useAppSelector } from "@/libs/redux/Store"
import { Box } from "@mui/system"
import dynamic from "next/dynamic"
const SymbolOverviewNoSSR = dynamic(() => import("react-ts-tradingview-widgets").then(w => w.AdvancedRealTimeChart), {
  ssr: false,
})

export default function TradingPage() {
  const mode = useAppSelector(state => state.ui.mode)
  return (
    <Box sx={{ mt: 2, height: "770px" }}>
      <SymbolOverviewNoSSR
        symbol="COINBASE:BTCUSD"
        copyrightStyles={{
          parent: {
            display: "none",
          },
        }}
        theme={mode === "light" ? "light" : "dark"}
        autosize
      />
    </Box>
  )
}
