import React from "react";

interface DateRange { from: string; to: string; }

interface FiltersProps {
  dateRange: DateRange;
  setDateRange: (v: DateRange) => void;
  preset: string;
  setPreset: (v: string) => void;
  fromDate: string;
  setFromDate: (v: string) => void;
  toDate: string;
  setToDate: (v: string) => void;
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
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="filters" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      {/* Date Preset / Custom */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select
          className="filter-select"
          value={props.preset}
          onChange={(e) => props.setPreset(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="last_7">Last 7 Days</option>
          <option value="last_30">Last 30 Days</option>
          <option value="last_90">Last 90 Days</option>
          <option value="custom">Custom</option>
        </select>

        {props.preset === "custom" && (
          <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            <input
              className="date-input"
              type="date"
              value={props.fromDate}
              max={today}
              onChange={(e) => props.setFromDate(e.target.value)}
            />
            <span className="date-sep">—</span>
            <input
              className="date-input"
              type="date"
              value={props.toDate}
              max={today}
              onChange={(e) => props.setToDate(e.target.value)}
            />
            <button
              className="apply-btn"
              onClick={() => props.onApplyCustom()}
            >
              Apply
            </button>
            <button
              className="clear-btn"
              onClick={() => {
                props.setPreset("last_7");
              }}
            >
              Reset
            </button>
          </div>
        )}

        {props.preset !== "custom" && props.preset !== "all" && (
          <div className="preset-summary" style={{ fontSize: 12, color: "#94a3b8" }}>
            {props.dateRange.from} → {props.dateRange.to}
          </div>
        )}
      </div>

      {/* Type Filter */}
      <select
        className="filter-select"
        value={props.typeFilter}
        onChange={(e) => props.setTypeFilter(e.target.value)}
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