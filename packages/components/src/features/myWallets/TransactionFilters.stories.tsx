import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TransactionFilters, type TransactionFiltersProps } from "./TransactionFilters";
import "./TransactionHistory.css";

/** Satisfies CSF `args` typing; demo components own real state via `useState`. */
const storyArgsStub: TransactionFiltersProps = {
  preset: "last_7",
  setPreset: () => {},
  fromDate: undefined,
  setFromDate: () => {},
  toDate: undefined,
  setToDate: () => {},
  onApplyCustom: () => {},
  typeFilter: "all",
  setTypeFilter: () => {},
  tokenFilter: "all",
  setTokenFilter: () => {},
  hideSpam: true,
  setHideSpam: () => {},
  uniqueTokens: [],
};

function TransactionFiltersDemo() {
  const [preset, setPreset] = useState("last_7");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState("all");
  const [tokenFilter, setTokenFilter] = useState("all");
  const [hideSpam, setHideSpam] = useState(true);

  return (
    <Stack
      spacing={2}
      sx={{ maxWidth: 900 }}>
      <Typography
        variant="body2"
        color="text.secondary">
        Transaction toolbar controls (scoped under `.transaction-history .filters` in{" "}
        <code>TransactionHistory.css</code>).
      </Typography>
      <Box
        className="transaction-history"
        sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
        <TransactionFilters
          preset={preset}
          setPreset={setPreset}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          onApplyCustom={() => {}}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          tokenFilter={tokenFilter}
          setTokenFilter={setTokenFilter}
          hideSpam={hideSpam}
          setHideSpam={setHideSpam}
          uniqueTokens={["ETH", "USDC", "WBTC"]}
        />
      </Box>
    </Stack>
  );
}

function CustomRangeDemo() {
  const [preset, setPreset] = useState("custom");
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date("2026-01-01"));
  const [toDate, setToDate] = useState<Date | undefined>(new Date("2026-01-31"));
  const [typeFilter, setTypeFilter] = useState("swap");
  const [tokenFilter, setTokenFilter] = useState("all");
  const [hideSpam, setHideSpam] = useState(false);

  return (
    <Box
      className="transaction-history"
      sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1, maxWidth: 900 }}>
      <TransactionFilters
        preset={preset}
        setPreset={setPreset}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onApplyCustom={() => {}}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        tokenFilter={tokenFilter}
        setTokenFilter={setTokenFilter}
        hideSpam={hideSpam}
        setHideSpam={setHideSpam}
        uniqueTokens={["ETH", "USDC"]}
      />
    </Box>
  );
}

const meta: Meta<TransactionFiltersProps> = {
  title: "MyWallets/TransactionFilters",
  component: TransactionFilters,
  args: storyArgsStub,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Date presets, custom range `AppDatePicker`s, type filter, and spam toggle. Copy uses `HistoricalWalletsWorth` + `Tooltips` i18n namespaces (wired in Storybook `preview.tsx`).",
      },
    },
  },
  tags: ["autodocs"],
  render: () => <TransactionFiltersDemo />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomRange: Story = {
  args: storyArgsStub,
  render: () => <CustomRangeDemo />,
};
