import { Typography,Box,TextField,Autocomplete } from "@mui/material"
import * as React from "react"
import {CustomThemeContext} from "./CustomThemeContext";

interface CurrencyDropdownProps {
    handleSymbolOne: (newSymbol: string) => void;
    handleSymbolTwo: (newSymbol: string) => void;
  }


export default function CurrencyDropdown({ handleSymbolOne, handleSymbolTwo }: CurrencyDropdownProps) {
  const themes = React.useContext(CustomThemeContext);


  const handleBuyCurrencyChange = (event: React.ChangeEvent<{}>, value: CountryType | null) => {
    handleSymbolOne(value?.symbol || ''); // Update symbol1 for buying
  };

  const handleSellCurrencyChange = (event: React.ChangeEvent<{}>, value: CountryType | null) => {
    handleSymbolTwo(value?.symbol || ''); // Update symbol2 for selling
  };

  return (
    <div className="currencyDropdown" style={{width:"36rem",height:"6rem" }}>
        <Typography
         sx={{
            fontWeight: '400',
            fontSize: 14,
            color: themes.currentTheme === "dark" ? "#FFFFFF" : "black",
          }}
          className="dropdownHeading"
        >I am buying/selling</Typography>
        <div  style={{ display: "flex", alignItems: "center",marginTop:10,justifyContent: "space-between" }}>
        <Autocomplete
            id="buy-currency"
            // defaultValue={currency.find(cur => cur.symbol === "USDT")}
            defaultValue={currencyBuying[0]}
            // sx={{ width: "14rem"}}
            sx={{ width: "14rem",  "& .MuiAutocomplete-inputRoot": {
                display: "flex",
                alignItems: "center",
                padding: '6px',
            }, "&:hover .MuiAutocomplete-inputRoot": { borderColor: "red" } }}
            options={currencyBuying}
            autoHighlight
            getOptionLabel={(option) => option.symbol}
            renderOption={(props, option) => (
                <Box component="li" {...props}>
                {option.symbol}
                </Box>
            )}
            onChange={handleBuyCurrencyChange}
            renderInput={(params) => (
                <TextField
                {...params}
                label="Choose currency"
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                    style: { // Style to prevent the input from overflowing
                        height: '100%',
                        width: '100%',
                        boxSizing: 'border-box',
                    },
                }}
                />
            )}
        />

        <Typography sx={{ marginX: "1.2rem",fontWeight: '400', }}>for</Typography>

        <Autocomplete
            id="sell-currency"
            // defaultValue={currency.find(cur => cur.symbol === "USD")}
            defaultValue={currencySelling[0]}
            // sx={{ width: "14rem"}}
            sx={{ width: "14rem",  "& .MuiAutocomplete-inputRoot": {
                display: "flex",
                alignItems: "center",
                padding: '6px',
            }, "&:hover .MuiAutocomplete-inputRoot": { borderColor: "red" } }}
            options={currencySelling}
            autoHighlight
            getOptionLabel={(option) => option.symbol}
            renderOption={(props, option) => (
                <Box component="li" {...props}>
                {option.symbol}
                </Box>
            )}
            onChange={handleSellCurrencyChange}

            renderInput={(params) => (
                <TextField
                {...params}
                label="Choose currency"
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                    style: { // Style to prevent the input from overflowing
                        height: '100%',
                        width: '100%',
                        boxSizing: 'border-box',
                    },
                }}
                />
            )}
        />

        </div>
    </div>
  )
}

interface CountryType {
    description: string;
    symbol: string;
  }

  const currency: readonly CountryType[] = [
    // { code: 'AD', label: 'Andorra', phone: '376' },
    {symbol:"USD",description:"USD"},
    {symbol:"BTC",description:"BTC"},
    {symbol:"USDT",description:"USDT"},

]

// creating it temporiroly to fix the input values of Buying/Selling individually
  const currencySelling: readonly CountryType[] = [
    // { code: 'AD', label: 'Andorra', phone: '376' },
    {symbol:"USD",description:"USD"},
    // {symbol:"BTC",description:"BTC"},
    // {symbol:"USDT",description:"USDT"},

]

const currencyBuying: readonly CountryType[] = [
    // { code: 'AD', label: 'Andorra', phone: '376' },
    // {symbol:"USD",description:"USD"},
    // {symbol:"BTC",description:"BTC"},
    {symbol:"USDT",description:"USDT"},

]
