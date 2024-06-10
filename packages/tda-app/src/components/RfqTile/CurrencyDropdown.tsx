import { Autocomplete, Stack, StackProps, TextField, Typography } from "@mui/material"
import { FC } from "react"

interface CurrencyDropdownProps extends StackProps {
  handleSymbolOne: (newSymbol: string | null) => void
  handleSymbolTwo: (newSymbol: string | null) => void
  options1: string[]
  options2: string[]
  symbol1: string | null
  symbol2: string | null
}

export default function CurrencyDropdown({
  handleSymbolOne,
  handleSymbolTwo,
  symbol1,
  symbol2,
  options1,
  options2,
  ...props
}: CurrencyDropdownProps) {
  return (
    <Stack {...props}>
      <Stack
        direction="row"
        alignItems="center"
        width="100%"
        justifyContent="space-between">
        <AutocomleteSection
          value={symbol1}
          options={options1}
          onChange={handleSymbolOne}
        />
        <Typography sx={{ marginX: "1.2rem", fontWeight: "400" }}>for</Typography>
        <AutocomleteSection
          value={symbol2}
          options={options2}
          onChange={handleSymbolTwo}
        />
      </Stack>
    </Stack>
  )
}

type AutocomleteSectionProps = {
  onChange: (value: string | null) => void
  options: readonly string[]
  value: string | null
}

const AutocomleteSection: FC<AutocomleteSectionProps> = ({ onChange, options, value }) => {
  return (
    <Autocomplete
      fullWidth
      value={value}
      options={options}
      autoHighlight
      onChange={(_, value) => onChange(value)}
      renderInput={params => (
        <TextField
          {...params}
          label="Choose currency"
          type="text"
        />
      )}
    />
  )
}
