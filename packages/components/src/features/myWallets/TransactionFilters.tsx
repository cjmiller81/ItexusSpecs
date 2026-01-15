import { useTheme } from "@mui/system";
import { useMemo } from "react";
import { AppDatePicker } from "../../components";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface DateRange { from: string; to: string; }

interface FiltersProps {
  preset: string;
  setPreset: (v: string) => void;
  fromDate: Date | undefined;
  setFromDate: (v: Date | undefined) => void;
  toDate: Date | undefined;
  setToDate: (v: Date | undefined) => void;
  onApplyCustom: () => void;

  typeFilter: string;
  setTypeFilter: (v: string) => void;
  tokenFilter: string;
  setTokenFilter: (v: string) => void;
  hideSpam: boolean;
  setHideSpam: (v: boolean) => void;
  uniqueTokens: string[];
}

export function TransactionFilters(props: FiltersProps) {
  const theme = useTheme();
  const today = new Date().toISOString().slice(0, 10);
  const { t } = useTranslation("HistoricalWalletsWorth");
  const maxFromDate = (props.toDate ? moment(props.toDate).add(-1, "d") : moment().add(-1, "d")).toDate();
  const minToDate = props.fromDate ? moment(props.fromDate).add(1, "d").toDate() : undefined;

  const filterColors = useMemo(() => ({ 
    backgroundColor: theme.palette.mode === "dark" ? "#363640" : "#fff",
    color: theme.palette.mode === "dark" ? "#cbd5e1" : "#4E4E57",
    borderColor: theme.palette.mode === "dark" ? "#4E4E57" : "#B5B1B1" 
  }), [theme]);

  return (
    <div className="filters" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      {/* Date Preset / Custom */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select
          className="filter-select"
          value={props.preset}
          onChange={(e) => props.setPreset(e.target.value)}
          style={filterColors}
        >
          <option value="all">All Time</option>
          <option value="last_7">Last 7 Days</option>
          <option value="last_30">Last 30 Days</option>
          <option value="last_90">Last 90 Days</option>
          <option value="custom">Custom</option>
        </select>

        <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <Stack
            gap={1}
            direction="row"
            style={{ marginTop: -22  }}
          >
            <AppDatePicker
              className="date-input"
              tooltip={t("Required", { ns: "Tooltips" })}
              required
              disableFuture
              value={props.fromDate}
              onChange={(date) => {
                props.setPreset("custom");
                props.setFromDate(date ?? undefined);
              }}
              maxDate={maxFromDate}
              label={t("FromDate")}
              labelSize="s"
            />
            <AppDatePicker
              className="date-input"
              tooltip={t("Required", { ns: "Tooltips" })}
              required
              disableFuture
              value={props.toDate}
              onChange={(date) => {
                props.setPreset("custom");
                props.setToDate(date ?? undefined);
              }}
              maxDate={new Date()}
              minDate={minToDate}
              label={t("ToDate")}
              labelSize="s"
            />
          </Stack>
          {props.preset === "custom" && (
            <>
              <button
                className="apply-btn"
                onClick={() => props.onApplyCustom()}
              >
                Apply
              </button>
              <button
                className="clear-btn"
                onClick={() => {
                  props.setPreset("all");
                }}
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Type Filter */}
      <select
        className="filter-select"
        value={props.typeFilter}
        onChange={(e) => props.setTypeFilter(e.target.value)}
        style={filterColors}
      >
        <option value="all">All Types</option>
        <option value="deposit">Deposit</option>
        <option value="withdraw">Withdraw</option>
        <option value="claim">Claim</option>
        <option value="swap">Swap</option>
        <option value="transfer">Transfer</option>
        <option value="native_transfer">ETH Transfer</option>
      </select>

      {/* Token Filter */}
      <select
        className="filter-select"
        value={props.tokenFilter}
        onChange={(e) => props.setTokenFilter(e.target.value)}
        style={filterColors}
      >
        <option value="all">All Tokens</option>
        {props.uniqueTokens.map((token) => (
          <option key={token} value={token}>
            {token}
          </option>
        ))}
      </select>

      {/* Spam Toggle */}
      <button
        className={`spam-toggle ${!props.hideSpam ? "showing-all" : ""}`}
        onClick={() => props.setHideSpam(!props.hideSpam)}
      >
        <span className="spam-toggle-label">
          {props.hideSpam ? "👁 Show All Transactions" : "🚫 Hide Spam Transactions"}
        </span>
        <div className="toggle-switch" />
      </button>
    </div>
  );
}