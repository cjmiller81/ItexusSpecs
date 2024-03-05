import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { useTranslation } from "react-i18next"

export default function MarketCapWeightedPage() {
  const { t } = useTranslation("MarketCapWeightedPage")

  return (
    <HistoricalWalletsWorth
      title={t("ChartTitle")}
      sx={{ textWrap: "nowrap", minWidth: "300px" }}
    />
  )
}
