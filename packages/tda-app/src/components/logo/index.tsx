import useConfig from "@/hooks/useConfig"
import { useTheme } from "@emotion/react"
import ButtonBase from "@mui/material/ButtonBase"
import Typography from "@mui/material/Typography"
import { SxProps } from "@mui/material/styles"
import { APP_DEFAULT_PATH } from "config"
import NextLink from "next/link"
import AppLogo from "../../../public/app-icon.svg"

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
      href={!to ? APP_DEFAULT_PATH : to}
      passHref
      legacyBehavior>
      <ButtonBase
        disableRipple
        sx={sx}>
        <AppLogo
          stroke={mode === "dark" ? "white" : "black"}
          width="50px"
          height="50px"
        />
        {!isIcon && <Typography variant="h5">{"Trillion Digital Assets"}</Typography>}
      </ButtonBase>
    </NextLink>
  )
}
