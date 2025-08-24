import { Autocomplete, Box, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


export type Dex = { id: string; title: string };

export interface Props {
  dexs: Dex[];
  isDexDropdownOpen: boolean;
  selectedDexs: Dex[];
  setIsDexDropdownOpen: (d: boolean) => void;
  setSelectedDexs: (d: Dex[]) => void;
  maxSelections?: number;
}


export default function MultiSelectDexDropdown({
  dexs,
  isDexDropdownOpen,
  selectedDexs,
  setSelectedDexs,
  setIsDexDropdownOpen,
  maxSelections = 5,
}: Props) {
  return (
    <Box>
      {selectedDexs.length >= maxSelections && (
        <Typography variant="caption" color="warning.main" mt={1}>
          Maximum {maxSelections} DEXs selected
        </Typography>
      )}
      <Autocomplete
        multiple
        options={dexs}
        value={selectedDexs}
        onChange={(_, newValue) => {
          if (newValue.length <= maxSelections) {
            setSelectedDexs(newValue);
          }
       }}
        open={!(selectedDexs.length >= maxSelections) && isDexDropdownOpen}
        onOpen={() => {
         if (!(selectedDexs.length >= maxSelections)) {
          setIsDexDropdownOpen(true);
         }
       }}
        onClose={() => setIsDexDropdownOpen(false)}
       filterSelectedOptions
       isOptionEqualToValue={(option, value) => option.id === value.id}
       getOptionLabel={(o) => o.title}
       limitTags={0}
       renderTags={() => null}
       renderInput={(params) => (
        <TextField
          {...params}
          placeholder={selectedDexs.length >= maxSelections ? "Maximum selections reached" : "Search and select DEXs..."}
          disabled={selectedDexs.length >= maxSelections}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
            <>
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
              {params.InputProps.startAdornment}
            </>
            )
          }}
        />
        )}
      />

    </Box>
  );
}