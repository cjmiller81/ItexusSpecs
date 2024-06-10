
import { CurrencyPair } from "@/api/rfq-api/models/CurrencyPair"
import { Autocomplete, AutocompleteProps, Stack, StackProps, TextField, Typography } from "@mui/material"
import { FC, useEffect } from "react"

interface CurrencyDropdownProps extends StackProps {
  onSymbol1Change: (newSymbol: string | null) => void
  onSymbol2Change: (newSymbol: string | null) => void
  pairs: CurrencyPair[]
  symbol1: string | null
  symbol2: string | null
}

export default function CurrencyDropdown({
  onSymbol1Change,
  onSymbol2Change,
  symbol1,
  symbol2,
  pairs,
  ...props
}: CurrencyDropdownProps) {
  const leftOptions: string[] = [...new Set(pairs.map<string>(pair => pair.symbol1))]
  const rightOptions: string[] = symbol1
    ? [...new Set(pairs.filter(pair => pair.symbol1 === symbol1).map(pair => pair.symbol2))]
    : []

  useEffect(() => {
    if (symbol2 && !pairs.some(pair => pair.symbol1 === symbol1 && pair.symbol2 === symbol2)) {
      onSymbol2Change(null)
    }
  }, [symbol1])

  return (
    <Stack {...props}>
      <Stack
        direction="row"
        alignItems="center"
        width="100%"
        justifyContent="space-between">
        <AutocomleteSection
          value={symbol1}
          options={leftOptions}
          onValueChange={onSymbol1Change}
        />
        <Typography sx={{ marginX: "1.2rem", fontWeight: "400" }}>for</Typography>
        <AutocomleteSection
          disabled={!symbol1}
          value={symbol2}
          options={rightOptions}
          onValueChange={onSymbol2Change}
        />
      </Stack>
    </Stack>
  )
}

type AutocomleteSectionProps = Omit<AutocompleteProps<string, false, false, true>, "renderInput"> & {
  onValueChange: (value: string | null) => void
}

const AutocomleteSection: FC<AutocomleteSectionProps> = ({ onValueChange, ...props }) => {
  return (
    <Autocomplete
      fullWidth
      autoHighlight
      onChange={(_, value) => onValueChange(value)}
      renderInput={params => (
        <TextField
          {...params}
          label="Choose currency"
          type="text"
        />
      )}
      {...props}
    />
  )
}
