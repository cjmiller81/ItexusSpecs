import { Theme } from "@emotion/react";
import "@mui/lab/themeAugmentation";
import { createTheme, PaletteMode, PaletteOptions } from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    link: true;
  }
}

declare module "@mui/material/styles/createTypography" {
  interface TypographyOptions {
    body3?: React.CSSProperties;
    body4?: React.CSSProperties;
    h7: React.CSSProperties;
  }

  interface Typography {
    body3: React.CSSProperties;
    body4: React.CSSProperties;
    h7: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    subtitle3: true;
    body3: true;
    body4: true;
    h7: true;
  }
}

const darkPalette: PaletteOptions = {
  primary: {
    main: "#219a83",
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
};

const darkEIPalette: PaletteOptions = {
  primary: {
    main: "#219a83",
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
    default: "#262626",
  },
};

const lightPalette: PaletteOptions = {
  primary: {
    main: "#219a83",
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
  background: {
    paper: "#f7f5f2", // Warm off-white for main cards
    default: "#e5ddd5", // Warmest beige
  },
};

const lightEIPalette: PaletteOptions = {
  primary: {
    main: "#219a83",
    light: "#CDEFFD",
  },
  success: {
    main: "#8BC34A",
    light: "#DFF5D7",
  },
  error: {
    light: "#FAE5E3",
    main: "#F44336",
  },
  background: {
    paper: "#f7f5f2", // Warm off-white for main cards
    default: "#e5ddd5", // Warmest beige
  },
};

const typographyOverrides: TypographyOptions = {
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
  body3: {
    fontSize: "0.625rem",
    lineHeight: 1.35,
    letterSpacing: "0.012em",
  },
  body4: {
    fontSize: "0.5rem",
    lineHeight: 1.3,
    letterSpacing: "0.013em",
  },
  h7: {
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
};

export const getAppTheme = (mode: PaletteMode) => {
  return getTheme(mode, "");
};

export const getEIAppTheme = (mode: PaletteMode) => {
  return getTheme(mode, "EI");
};

const getTheme = (mode: PaletteMode, themeType: string): Theme => {
  let palette: PaletteOptions;

  if (mode === "dark") {
    palette = themeType === "EI" ? darkEIPalette : darkPalette;
  } else {
    palette = themeType === "EI" ? lightEIPalette : lightPalette;
  }

  const commonTheme = createTheme({
    palette: {
      mode,
      ...palette,
    },
    typography: typographyOverrides,
  });

  const finaleTheme = createTheme(
    {
      typography: {
        subtitle2: {
          fontSize: "0.75rem",
          color: commonTheme.palette.mode === "dark" ? commonTheme.palette.grey[400] : commonTheme.palette.grey[500],
        },
        h7: {
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
          styleOverrides: {
            root: () => ({
              transition: "none",
              boxShadow: commonTheme.shadows[1],
              color: commonTheme.palette.background.paper,
            }),
          },
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
          ],
        },
      },
    },
    commonTheme,
  );

  return finaleTheme;
};
