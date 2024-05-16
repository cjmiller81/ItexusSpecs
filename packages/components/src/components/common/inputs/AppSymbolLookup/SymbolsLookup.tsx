import Search from "@mui/icons-material/Search"
import { Box, CircularProgress, Popper, Autocomplete } from "@mui/material"
import { AutocompleteProps, autocompleteClasses } from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { styled } from "@mui/material/styles"
import * as React from "react"
import { useTranslation } from "react-i18next"
import { AppInputLabel } from "../AppInputLabel"
import { AppInputProps } from "../AppInputProps"
import { ListboxComponent } from "./ListBoxComponent"

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
})

export interface LookUpOption {
  label: string
  iconUrl?: string | null
  tokenId: string
}

interface Props extends AppInputProps, Omit<AutocompleteProps<LookUpOption, false, false, false, any>, "renderInput"> {
  options: LookUpOption[]
  value?: LookUpOption | null
}

export function SymbolLookup({ label, required, tooltip, value, loading, options, ...props }: Props) {
  const { t } = useTranslation("SymbolLookup")

  return (
    <div>
      <AppInputLabel
        fieldLabel={label}
        required={false}
        tooltip={tooltip}
      />
      <Autocomplete
        sx={{
          " .MuiInputBase-root": {
            display: "flex",
            flexWrap: "nowrap",
          },
        }}
        id="virtualize-demo"
        disableListWrap
        PopperComponent={StyledPopper as any}
        ListboxComponent={ListboxComponent as any}
        options={options}
        {...props}
        value={value}
        renderInput={params => (
          <TextField
            placeholder={t("Search")}
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
                  <Search />
                  {value && value.iconUrl && (
                    <img
                      style={{ marginLeft: 8, marginRight: 4 }}
                      loading="lazy"
                      width="20"
                      src={value.iconUrl}
                      alt=""
                    />
                  )}
                </Box>
              ),
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option, state) => [props, option, state.index] as React.ReactNode}
        renderGroup={params => params as any}
      />
    </div>
  )
}
