import Autocomplete from "@mui/material/Autocomplete"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import AppInputLabel from "./AppInputLabel"

export interface LookUpOption {
  label: string
  iconUrl?: string
}

export interface Props {
  options: LookUpOption[]
  value?: LookUpOption | null
  label: string
  //eslint-disable-next-line no-unused-vars
  onChange: (option: LookUpOption | null) => void
}

export default function SymbolLookup({ options, value, onChange, label }: Props) {
  return (
    <div>
      <AppInputLabel
        fieldLabel={label}
        required={false}
      />
      <Autocomplete
        options={options}
        autoHighlight
        onChange={(_, option) => onChange(option)}
        getOptionLabel={option => option.label}
        value={value}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}>
            <img
              loading="lazy"
              width="20"
              src={option.iconUrl}
              alt=""
            />
            {option.label}
          </Box>
        )}
        renderInput={params => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
          />
        )}
      />
    </div>
  )
}
