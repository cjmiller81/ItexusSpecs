import { useAppSelector } from "@/libs/redux/Store";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
const SymbolOverviewNoSSR = dynamic(() => import("react-ts-tradingview-widgets").then(w => w.AdvancedRealTimeChart), {
  ssr: false,
});

export default function TradingPage() {
  const mode = useAppSelector(state => state.ui.mode);
  const { t } = useTranslation("TradingPage");
  return (
    <Box sx={{ mt: 2, height: "770px" }}>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 0 }}>
        {t("TradingCharts")}
      </Typography>
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
  );
}
