import useConfig from "@/hooks/useConfig"
import { useTheme } from "@emotion/react"
import ButtonBase from "@mui/material/ButtonBase"
import Typography from "@mui/material/Typography"
import { SxProps } from "@mui/material/styles"
import { Box } from "@mui/system"
import { APP_DEFAULT_PATH } from "config"
import NextLink from "next/link"
import AppLogoBlack from "../../../public/tda-logo-black.svg"
import AppLogoWhite from "../../../public/tda-logo-white.svg"

interface Props {
  reverse?: boolean
  isIcon?: boolean
  sx?: SxProps
  to?: string
}

export default function LogoSection({ reverse, isIcon, sx, to }: Props) {
  const theme = useTheme()
  const { mode } = useConfig()

  return (
    <NextLink
      href={!to ? "/" : to}
      passHref
      legacyBehavior>
      <ButtonBase
        disableRipple
        sx={{ ...sx }}>
        {
          <Box width={"45px"}>
            {mode === "dark" ? (
              <AppLogoWhite
                width={"45px"}
                height={"45px"}
              />
            ) : (
              <AppLogoBlack
                width={"45px"}
                height={"45px"}
              />
            )}
          </Box>
        }
        {!isIcon && (
          <Typography
            ml={1}
            variant="h5">
            {"Trillion Digital Assets"}
          </Typography>
        )}
      </ButtonBase>
    </NextLink>
  )
}
