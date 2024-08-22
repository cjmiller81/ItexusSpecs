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
import { ListOnItemsRenderedProps } from "react-window"

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
  id: string
}

export interface SymbolsLookupProps extends AppInputProps, Omit<AutocompleteProps<LookUpOption | null, false, false, false, any>, "renderInput"> {
  options: (LookUpOption | null)[]
  value?: LookUpOption | null
  onItemsRendered?: (props: ListOnItemsRenderedProps) => any
}

export function SymbolLookup({ label, required, tooltip, onItemsRendered, value, loading, options, ...props }: SymbolsLookupProps) {
  const { t } = useTranslation("SymbolLookup")

  const onItemsRenderedLocal = (renderProps: ListOnItemsRenderedProps) => {
    if (onItemsRendered) {
      onItemsRendered(renderProps)
    }
  }

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
        disableListWrap
        PopperComponent={StyledPopper as any}
        ListboxComponent={ListboxComponent}
        ListboxProps={{
          onItemsRendered: onItemsRenderedLocal
        } as any}
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
