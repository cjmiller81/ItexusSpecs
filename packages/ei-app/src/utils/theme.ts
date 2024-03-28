import { Theme } from "@emotion/react"
import "@mui/lab/themeAugmentation"
import { createTheme, PaletteMode, PaletteOptions } from "@mui/material"
import { TypographyOptions } from "@mui/material/styles/createTypography"

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    link: true
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    subtitle3: true
  }
}

const darkPalette: PaletteOptions = {
  primary: {
    main: "#26BAFC",
    light: "#2F4355",
  },
  success: {
    main: "#8BC34A",
    light: "#404641",
  },
  error: {
    light: "#4C373E",
    main: "#F64336",
  },
  background: {
    paper: "#363640",
    default: "#363640",
  },
}

const lightPalette: PaletteOptions = {
  primary: {
    main: "#03A9F4",
    light: "#E0F4FD",
  },
  success: {
    main: "#8BC34A",
    light: "#F1F7E9",
  },
  error: {
    light: "#FDE8E6",
    main: "#F64336",
  },
}

const typographyOverrides: TypographyOptions = {
  //fontFamily: "font-family: Roboto, RobotoFallback, Noto Kufi Arabic, Helvetica, Arial, sans-serif;",
  fontWeightBold: 700,
  fontWeightMedium: 500,
  fontWeightRegular: 400,
  fontSize: 12,
  button: {
    fontWeight: 500,
    fontSize: 13,
    lineHeight: "normal",
    padding: "5px",
  },
}

export const getAppTheme = (mode: PaletteMode): Theme => {
  const commonTheme = createTheme({
    palette: {
      mode,
      ...(mode === "light" ? lightPalette : darkPalette),
    },
    typography: typographyOverrides,
  })

  const finaleTheme = createTheme(
    {
      typography: {
        subtitle2: {
          fontSize: "0.75rem",
          color: commonTheme.palette.mode === "dark" ? commonTheme.palette.grey[400] : commonTheme.palette.grey[500],
        },
      },
      components: {
        MuiTabPanel: {
          styleOverrides: {
            root: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        },
        MuiAccordionSummary: {
          styleOverrides: {
            root: {
              backgroundColor: commonTheme.palette.background.paper,
            },
          },
        },
        MuiButton: {
          defaultProps: {},
          variants: [
            {
              props: { variant: "link" },
              style: {
                textTransform: "none",
                border: `none`,
                minWidth: 0,
                padding: 0,
                fontWeight: 400,
                color: commonTheme.palette.primary.main,
                ":hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              },
            },
            {
              props: { variant: "outlined" },
              style: {
                transition: "none",
                border: "1px solid",
                borderColor: commonTheme.palette.divider,
                color: commonTheme.palette.text.primary,
                shadow: 0,
                ":hover": {
                  borderColor: commonTheme.palette.divider,
                },
              },
            },
            {
              props: { variant: "contained" },
              style: {
                transition: "none",
                boxShadow: commonTheme.shadows[1],
                color: commonTheme.palette.background.paper,
              },
            },
          ],
        },
      },
    },
    commonTheme,
  )

  return finaleTheme
}
