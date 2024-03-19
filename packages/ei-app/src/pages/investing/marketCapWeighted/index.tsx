import { IndexModelingSection } from "@/containers/Investing/IndexModelingSection"
import DataGridComponent from "@/components/DataDisplay/DataGrid"
import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { assets } from "@/mocks/InvestingTableAsset"
import { Stack } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function MarketCapWeightedPage() {
  const { t } = useTranslation("MarketCapWeightedPage")

  return (
    <Stack>
      <DataGridComponent />
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
