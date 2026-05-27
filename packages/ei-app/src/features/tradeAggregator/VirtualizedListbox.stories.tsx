import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Autocomplete, Box, TextField } from "@mui/material";

import { VirtualizedListbox } from "./VirtualizedListbox";

const sampleTokens = Array.from({ length: 200 }).map((_, i) => ({
  id: `token-${i}`,
  label: `TOKEN${i.toString().padStart(3, "0")}`,
}));

// VirtualizedListbox is an Autocomplete `ListboxComponent` slot — show it in
// situ inside an open Autocomplete to demonstrate the windowed rendering.
const Host = () => (
  <Box sx={{ width: 360, padding: 2 }}>
    <Autocomplete
      open
      options={sampleTokens}
      getOptionLabel={o => o.label}
      ListboxComponent={VirtualizedListbox}
      renderInput={params => (
        <TextField
          {...params}
          placeholder="Search tokens…"
        />
      )}
      sx={{ "& .MuiAutocomplete-popper": { position: "static" } }}
    />
  </Box>
);

const meta = {
  title: "EI App/TradeAggregator/VirtualizedListbox",
  component: Host,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Host>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
