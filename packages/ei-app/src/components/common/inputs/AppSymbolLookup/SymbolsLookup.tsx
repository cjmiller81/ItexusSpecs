import SearchIcon from "@mui/icons-material/Search"
import { CircularProgress } from "@mui/material"
import Autocomplete, { AutocompleteProps, autocompleteClasses } from "@mui/material/Autocomplete"
import Popper from "@mui/material/Popper"
import TextField from "@mui/material/TextField"
import { styled } from "@mui/material/styles"
import * as React from "react"
import { useTranslation } from "react-i18next"
import AppInputLabel from "../AppInputLabel"
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
}

export interface Props extends Omit<AutocompleteProps<LookUpOption, false, false, false, any>, "renderInput"> {
  options: LookUpOption[]
  value?: LookUpOption | null
  label: string
}

export default function SymbolLookup({ label, loading, options, ...props }: Props) {
  const { t } = useTranslation("SymbolLookup")

  return (
    <div>
      <AppInputLabel
        fieldLabel={label}
        required={false}
      />
      <Autocomplete
        id="virtualize-demo"
        disableListWrap
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={options}
        {...props}
        renderInput={params => (
          <TextField
            placeholder={t("Search")}
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: <SearchIcon />,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
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
