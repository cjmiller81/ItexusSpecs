import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { useTranslation } from "react-i18next"

export default function MarketCapEqualWeightedPage() {
  const { t } = useTranslation("MarketCapEqualWeightedPage")
  return (
    <HistoricalWalletsWorth
      title={t("ChartTitle")}
      sx={{ textWrap: "nowrap", minWidth: "300px" }}
    />
  )
}
