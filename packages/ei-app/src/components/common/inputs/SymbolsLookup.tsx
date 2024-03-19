import Autocomplete from "@mui/material/Autocomplete"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Image from "next/image"

import AppInputLabel from "./AppInputLabel"
import { ICoin } from "@/services/backend-api.service"

export interface Props {
  options: ICoin[]
  value?: ICoin | null
  label: string
  //eslint-disable-next-line no-unused-vars
  onChange: (option: ICoin | null) => void
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
        getOptionLabel={option => option.name}
        value={value}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}>
            <Image
              loading="lazy"
              width={20}
              src={option.lURI as string}
              alt=""
            />
            {option.name}
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
