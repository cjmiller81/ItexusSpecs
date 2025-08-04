import React from "react";
import { Box, Typography, TextField, Select, MenuItem, Checkbox } from "@mui/material";

interface EntryOrderPanelProps {
  t: (key: string) => string;
  amount: number;
  formatNumber: (value: number) => string;
  handleChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;

  oiCapPercent: number;
  setOiCapPercent: (val: number) => void;

  entryType: string;
  handleEntryTypeChange: (e: any) => void;

  useLaddering: boolean;
  setUseLaddering: (val: boolean) => void;
  shouldDisableLaddering: boolean;
  shouldShowHint: boolean;

  offsetPercent: number;
  handleOffsetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  tradeUnderlyingFound: boolean;
  onlyTradeUnderlying: boolean;
  handleTradeUnderlyingFoundChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnlyTradeUnderlyingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  cancelAndResubmitOnPartial: boolean;
  setCancelAndResubmitOnPartial: (val: boolean) => void;

  isBreakUpEnabled: boolean;
  setIsBreakUpEnabled: (val: boolean) => void;
  breakUp: number;
  handleBreakUpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  isSendTriggerChecked: boolean;
  setIsSendTriggerChecked: (val: boolean) => void;
  borderColor?: string;
}

const EntryOrderPanel: React.FC<EntryOrderPanelProps> = ({
  t,
  amount,
  formatNumber,
  handleChangeAmount,

  oiCapPercent,
  setOiCapPercent,

  entryType,
  handleEntryTypeChange,

  useLaddering,
  setUseLaddering,
  shouldDisableLaddering,
  shouldShowHint,

  offsetPercent,
  handleOffsetChange,

  tradeUnderlyingFound,
  onlyTradeUnderlying,
  handleTradeUnderlyingFoundChange,
  handleOnlyTradeUnderlyingChange,

  cancelAndResubmitOnPartial,
  setCancelAndResubmitOnPartial,

  isBreakUpEnabled,
  setIsBreakUpEnabled,
  breakUp,
  handleBreakUpChange,

  isSendTriggerChecked,
  setIsSendTriggerChecked,

  borderColor
}) => {
  return (
    <Box>
      <Box
        sx={{
          width: "450px",
          bgcolor: "#2A2A2A",
          p: 3,
          borderRadius: 2,
          color: "white",
          minHeight: "670px",
          marginTop: "25px",
          border: `2px solid ${borderColor}`,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: "10px" }}>
          {t("EntryOrder")}
        </Typography>

        {/* Top Row */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>{t("TotalDollarAmount")}</Typography>
              <TextField
                variant="outlined"
                value={formatNumber(amount)}
                onChange={handleChangeAmount}
                sx={{
                  bgcolor: "#1E1E1E",
                  input: { color: "white", textAlign: "center" },
                  width: "150px",
                  "& .MuiOutlinedInput-root": { height: "40px" },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>{t("OIPercentCap")}</Typography>
              <TextField
                type="number"
                variant="outlined"
                value={oiCapPercent}
                onChange={(e) => setOiCapPercent(Number(e.target.value))}
                sx={{
                  bgcolor: "#1E1E1E",
                  input: { color: "white", textAlign: "center" },
                  width: "110px",
                  "& .MuiOutlinedInput-root": { height: "40px" },
                }}
              />
            </Box>
          </Box>

          {/* Entry Type + Laddering */}
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>{t("EntryType")}</Typography>
              <Select
                value={entryType}
                onChange={handleEntryTypeChange}
                displayEmpty
                sx={{
                  width: "170px",
                  height: "40px",
                  color: "white",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                  "& .MuiSelect-icon": { color: "#fff" },
                }}
              >
                <MenuItem value="Use_Bid">{t("Use_Bid")}</MenuItem>
                <MenuItem value="Use_Mid">{t("Use_Mid")}</MenuItem>
                <MenuItem value="Use_Ask">{t("Use_Ask")}</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
              <Checkbox
                checked={useLaddering}
                onChange={(e) => setUseLaddering(e.target.checked)}
                disabled={shouldDisableLaddering}
                sx={{
                  color: "gray",
                  "&.Mui-checked": { color: "gray" },
                  "&.Mui-disabled": { color: "rgba(255, 255, 255, 0.33)" },
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontSize: "13px", color: shouldDisableLaddering ? "gray" : "white" }}>
                  {t("UseLaddering")}
                </Typography>
                {shouldShowHint && (
                  <Typography sx={{ fontSize: "10px", fontStyle: "italic", color: "gray" }}>
                    {t("OffsetMustBe")}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Offset */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Typography>{t("OffsetPercent")}</Typography>
          <TextField
            type="number"
            value={offsetPercent}
            onChange={handleOffsetChange}
            sx={{
              bgcolor: "#1E1E1E",
              input: { color: "white", textAlign: "center" },
              width: "100px",
              "& .MuiOutlinedInput-root": { height: "40px" },
            }}
          />
        </Box>

        {/* Bottom Options */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <CheckboxWithLabel
              checked={tradeUnderlyingFound}
              onChange={handleTradeUnderlyingFoundChange}
              label={t("TradeUnderlyingOptionFound")}
              disabled={onlyTradeUnderlying}
              color={onlyTradeUnderlying && tradeUnderlyingFound ? "gray" : "white"}
            />

            <CheckboxWithLabel
              checked={onlyTradeUnderlying}
              onChange={handleOnlyTradeUnderlyingChange}
              label={t("OnlyTradeUnderlying")}
            />

            <CheckboxWithLabel
              checked={cancelAndResubmitOnPartial}
              onChange={(e) => setCancelAndResubmitOnPartial(e.target.checked)}
              label={t("CancelResubmitNoPartialFill")}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Checkbox
                checked={isBreakUpEnabled}
                onChange={(e) => setIsBreakUpEnabled(e.target.checked)}
                sx={{ color: "gray", p: 0 }}
              />
              <Typography sx={{ fontSize: "13px", color: "white" }}>
                {t("BreakUpOrder")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Typography sx={{ fontSize: "13px", color: isBreakUpEnabled ? "white" : "gray" }}>
                  {t("OrderBreaks")}
                </Typography>
                <TextField
                  placeholder="20"
                  type="number"
                  variant="outlined"
                  value={breakUp}
                  onChange={handleBreakUpChange}
                  disabled={!isBreakUpEnabled}
                  sx={{
                    bgcolor: "#1E1E1E",
                    width: "70px",
                    ml: 1,
                    input: { color: "white", textAlign: "center" },
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                      opacity: isBreakUpEnabled ? 1 : 0.5,
                    },
                  }}
                />
              </Box>
            </Box>

            <CheckboxWithLabel
              checked={isSendTriggerChecked}
              onChange={(e) => setIsSendTriggerChecked(e.target.checked)}
              label={t("SendTriggerExitOrder")}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const CheckboxWithLabel = ({
  checked,
  onChange,
  label,
  disabled = false,
  color = "white",
}: {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  disabled?: boolean;
  color?: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Checkbox checked={checked} onChange={onChange} disabled={disabled} sx={{ color: "gray", p: 0 }} />
    <Typography sx={{ fontSize: "13px", color, mt: 0.5 }}>{label}</Typography>
  </Box>
);

export default EntryOrderPanel;
