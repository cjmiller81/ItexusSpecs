import { Typography } from "@mui/material"
import { blue, grey, red } from "@mui/material/colors"
import { Box, BoxProps, Stack, TypographyProps, lighten, useTheme } from "@mui/system"
import { FC } from "react"

type Props = {
  cellType: "buy" | "sell"
  title: string
  value?: number | null
  isExpired: boolean
  isRequesting: boolean
  onCellClick: () => void
  contentAlignment?: "center" | "start" | "end"
}

export const BuySellCell: FC<Props & BoxProps> = ({
  title,
  value,
  isExpired,
  isRequesting,
  cellType,
  onCellClick,
  contentAlignment,
  sx,
  ...props
}) => {
  const theme = useTheme()
  let bgColor: string = theme.palette.mode === "dark" ? grey[800] : grey[200]

  if (value && cellType === "buy") {
    bgColor = theme.palette.mode === "dark" ? red[700] : red[400]
  }

  if (value && cellType === "sell") {
    bgColor = theme.palette.mode === "dark" ? blue[700] : blue[400]
  }
  return (
    <Box
      borderRadius={2}
      p={1}
      width="auto"
      sx={{
        minWidth: "140px",
        height: "max-content",
        cursor: "pointer",
        backgroundColor: bgColor,
        minHeight: "72px",
        "&:hover": {
          transition: "0.3s",
          backgroundColor: lighten(bgColor, 0.2),
        },
        ...sx,
      }}
      {...props}
      onClick={onCellClick}>
      <Stack alignItems={contentAlignment ?? "start"}>
        <Typography
          sx={{
            fontSize: 12,
          }}>
          {title}
        </Typography>
        <Typography
          component="div"
          sx={{
            fontSize: 20,
          }}>
          {renderInlargedNum(value)}
        </Typography>
      </Stack>
    </Box>
  )
}

const renderInlargedNum = (value?: number | null) => {
  const [integerPart, decimalPart] = value ? value.toFixed(5).split(".") : ["", ""]
  return (
    <Box component="div">
      {integerPart}
      {Boolean(integerPart.length) && "."}
      {decimalPart.split("").map((digit, index) => {
        if (index === 2 || index === 3) {
          return (
            <Typography
              sx={{ fontSize: "32px", lineHeight: 1.2 }}
              component="span"
              key={index}>
              {digit}
            </Typography>
          )
        } else {
          return (
            <Typography
              sx={{ fontSize: "18px" }}
              component="span"
              key={index}>
              {digit}
            </Typography>
          )
        }
      })}
    </Box>
  )
}

export const ExpiredLabel: FC = ({ ...props }: TypographyProps) => {
  return (
    <Typography
      fontSize="12px"
      color={theme => theme.palette.error.main}
      {...props}>
      Expired
    </Typography>
  )
}
