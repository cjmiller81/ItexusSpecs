import { Box, ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Subscribe } from "@react-rxjs/core";
import {
  ThemeProvider as MaterialThemeProvider,
  createTheme as muiCreateTheme,
  THEME_ID,
} from '@mui/material/styles';

import chakraTheme from "./components/theme"
import TradingTools from "./components/TradingTools"

import "@fontsource/ubuntu/400.css"
import "@fontsource/ubuntu/500.css"
import "@fontsource/ubuntu/700.css"
//import 'devextreme/dist/css/dx.material.blue.dark.css';
import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import './themes/dx-styles.scss';

const materialTheme = muiCreateTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    "fontFamily": "Ubuntu"
  }
});
const queryClient = new QueryClient()

function App() {
  return (
    <div className="dx-viewport dx-device-desktop dx-device-generic dx-theme-material dx-theme-material-typography dx-color-scheme-blue-dark">
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <ChakraProvider theme={chakraTheme} resetCSS>
          <MaterialThemeProvider theme={{ [THEME_ID]: materialTheme }}>
            <Box w="full" minH="100vh" bg="#101628" px="6" py="12">
              <Subscribe>
                <TradingTools />
              </Subscribe>
            </Box>
          </MaterialThemeProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
