import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import TrendingDownIcon from "@mui/icons-material/TrendingDown"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import { Box, BoxProps, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
export interface Props extends BoxProps {
  totalWorth: number
  growPercentage: number
}

export const TotalWalletsWorthCard = ({ totalWorth, growPercentage, sx, ...props }: Props) => {
  const { t } = useTranslation("TotalWalletsWorthCard")

  const growMain = growPercentage >= 0 ? "success.main" : "error.main"
  const growLight = growPercentage >= 0 ? "success.light" : "error.light"
  const totalWorthFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalWorth)
  const growPercentageFormatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(growPercentage)

  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        gap: 2,
        boxShadow: 5,
        padding: 2,
        width: "fit-content",
        borderRadius: 2,
        ...sx,
      }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          padding: 1,
          backgroundColor: growLight,
          position: "relative",
          borderRadius: "50%",
          alignSelf: "center",
        }}>
        {growPercentage >= 0 ? (
          <TrendingUpIcon
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: growMain,
            }}
          />
        ) : (
          <TrendingDownIcon
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: growMain,
            }}
          />
        )}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="subtitle1">{t("TotalWalletWorth")}</Typography>
        <Typography
          sx={{ fontWeight: "bold" }}
          variant="subtitle1">
          {totalWorthFormatted}
        </Typography>
      </Box>

      <Box>
        <Box
          sx={{
            backgroundColor: growLight,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            padding: 0.7,
            paddingRight: 2,
          }}>
          {growPercentage >= 0 ? (
            <ArrowDropUpIcon sx={{ color: growMain }} />
          ) : (
            <ArrowDropDownIcon sx={{ color: growMain }} />
          )}
          <Typography
            variant="body2"
            fontWeight={600}
            fontSize={12}
            sx={{ backgroundColor: growLight, color: growMain }}>{`${growPercentageFormatted}%`}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
