import { IndexModelingSection } from "@/containers/Investing/IndexModelingSection"
import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { assets } from "@/mocks/InvestingTableAsset"
import { Stack } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function MarketCapEqualWeightedPage() {
  const { t } = useTranslation("MarketCapEqualWeightedPage")
  return (
    <Stack>
      <IndexModelingSection
        tableAssets={assets}
        title={t("IndexModeling")}
      />
      <HistoricalWalletsWorth
        title={t("ChartTitle")}
        sx={{ textWrap: "nowrap", minWidth: "300px", mt: 4 }}
      />
    </Stack>
  )
}
