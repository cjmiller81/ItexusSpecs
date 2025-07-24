import React, { useEffect, useMemo, useState } from "react";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import debounce from "lodash.debounce";
import { useAppDispatch } from "components";
import { clearSymbols, fetchMarketSymbolsRegex } from "@/slices/symbolSlice";
import { useAppSelector } from "@/libs/redux/Store";
import { Instrument } from "@/slices/dpdOptionsScanSlice";

interface SymbolSearchProps {
  value: Instrument | null;
  onChange: (value: Instrument | null) => void;
  placeholder?: string;
}

const SymbolSearchAutoComplete: React.FC<SymbolSearchProps> = ({ value, onChange, placeholder }) => {
  const dispatch = useAppDispatch();
  const { symbols, loading } = useAppSelector((state) => state.symbol);
  const [inputValue, setInputValue] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (value.trim() === "") {
          dispatch(clearSymbols());
          return;
        }
        dispatch(fetchMarketSymbolsRegex(value));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(inputValue);
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  return (
    <Autocomplete
      sx={{
        bgcolor: "#1E1E1E",
        width: "100%",
        maxWidth: "180px",
        "& .MuiOutlinedInput-root": {
        height: "40px",
        padding: 0,
        display: "flex",
        alignItems: "center",
        },
        "& .MuiAutocomplete-input": {
        padding: "0 12px",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        color: "white",
        },
    }}
      getOptionLabel={(option: Instrument) =>
        `${option.symbol} (${option.assetType}) - ${option.description}`
      }
      options={symbols}
      loading={loading}
      value={value}
      onChange={(_, newValue) => {
        onChange(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      isOptionEqualToValue={(option, val) => !!option && !!val && option.symbol === val.symbol}

      renderInput={(params) => (
        <TextField
            {...params}
            placeholder={placeholder || "Enter ticker"}
            variant="outlined"
            InputProps={{
            ...params.InputProps,
            sx: {
                height: "40px",
                alignItems: "center",
                display: "flex",
            },
            endAdornment: (
                <>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
                </>
            ),
            }}
            inputProps={{
            ...params.inputProps,
            autoComplete: "off",
            style: {
                padding: 0,
                paddingLeft: "12px",
                height: "100%",
                display: "flex",
                alignItems: "center",
            },
            }}
        />
        )}
    />
  );
};

export default SymbolSearchAutoComplete;
