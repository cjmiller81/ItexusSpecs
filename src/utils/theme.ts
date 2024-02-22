import { PaletteMode, PaletteOptions, createTheme } from '@mui/material'
import { Theme } from '@emotion/react'

const darkPalette: PaletteOptions = {
  primary: {
    main: '#26BAFC',
    light: '#2F4355',
  },
  success: {
    main: '#8BC34A',
    light: '#404641',
  },
  error: {
    light: '#4C373E',
    main: '#F64336',
  },
  background: {
    paper: '#363640',
    default: '#363640',
  },
}

const lightPalette: PaletteOptions = {
  primary: {
    main: '#03A9F4',
    light: '#E0F4FD',
  },
  success: {
    main: '#8BC34A',
    light: '#F1F7E9',
  },
  error: {
    light: '#FDE8E6',
    main: '#F64336',
  },
}

export const getAppTheme = (mode: PaletteMode): Theme => {
  const commonTheme = createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
    typography: {
      button: {
        fontWeight: 500,
        fontSize: '13px',
        lineHeight: 'normal',
        padding: '5px',
      },
    },
  })

  const finaleTheme = createTheme(
    {
      components: {
        MuiButton: {
          defaultProps: {
            sx: {
              letterSpacing: '.04em',
              lineHeight: 'normal',
            },
          },
          variants: [
            {
              props: { variant: 'outlined' },
              style: {
                border: '1px solid',
                borderColor: commonTheme.palette.divider,
                color: commonTheme.palette.text.primary,
                shadow: 0,
                ':hover': {
                  borderColor: commonTheme.palette.divider,
                },
              },
            },
            {
              props: { variant: 'contained' },
              style: {
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
