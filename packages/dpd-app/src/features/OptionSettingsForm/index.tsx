import React from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
} from "@mui/material";
import { TFunction } from "i18next";
import SymbolSearchAutocomplete from "@/common/symbolSearchAutocomplete";
import { Instrument } from "@/slices/dpdOptionsScanSlice";

interface OptionSettingsFormProps {
  ticker: Instrument | null;
  setTicker: (value: Instrument | null) => void;
  dteMin: number;
  setDteMin: (value: number) => void;
  dteMax: number;
  setDteMax: (value: number) => void;
  requireActiveBid: boolean;
  setRequireActiveBid: (value: boolean) => void;
  isBAMaxEnabled: boolean;
  setIsBAMaxEnabled: (value: boolean) => void;
  bidAskMax: number | "";
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnableToggle: () => void;
  minContractAsk: number;
  setMinContractAsk: (value: number) => void;
  tradeAsSet: boolean;
  setTradeAsSet: (value: boolean) => void;
  minOpenInterest: number;
  setMinOpenInterest: (value: number) => void;
  minVolume: number;
  setMinVolume: (value: number) => void;
  baSpreadDiff: number;
  setBaSpreadDiff: (value: number) => void;
  borderColor: string;
  t: TFunction;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const OptionSettingsForm: React.FC<OptionSettingsFormProps> = ({
  ticker,
  setTicker,
  dteMin,
  setDteMin,
  dteMax,
  setDteMax,
  requireActiveBid,
  setRequireActiveBid,
  isBAMaxEnabled,
  setIsBAMaxEnabled,
  bidAskMax,
  handleChange,
  handleEnableToggle,
  minContractAsk,
  setMinContractAsk,
  tradeAsSet,
  setTradeAsSet,
  minOpenInterest,
  setMinOpenInterest,
  minVolume,
  setMinVolume,
  baSpreadDiff,
  setBaSpreadDiff,
  borderColor,
  t,
  onSubmit
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          width: "auto",
          bgcolor: "#2A2A2A",
          p: 3,
          borderRadius: 2,
          color: "white",
          marginTop: "25px",
          border: `2px solid ${borderColor}`,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: "10px" }}>
          {t("OptionDetails")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <form onSubmit={onSubmit} style={{ flexGrow: 1 }}>
              <SymbolSearchAutocomplete
                value={ticker}
                onChange={setTicker}
                placeholder="Enter ticker"
              />
              <button type="submit" style={{ display: "none" }} />
            </form>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography sx={{ color: "white", minWidth: "95px" }}>{t("DTERange")}</Typography>
            <TextField
              type="number"
              value={dteMin}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                if (newValue >= 0 && newValue < dteMax) setDteMin(newValue);
              }}
              sx={{
                bgcolor: "#1E1E1E",
                input: { color: "white", textAlign: "center", padding: "10px 12px" },
                width: "109px",
                "& .MuiOutlinedInput-root": { height: "40px" },
              }}
            />
            <Typography sx={{ color: "white" }}>{t("to")}</Typography>
            <TextField
              type="number"
              value={dteMax}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                if (newValue >= 0 && newValue > dteMin) setDteMax(newValue);
              }}
              sx={{
                bgcolor: "#1E1E1E",
                input: { color: "white", textAlign: "center", padding: "10px 12px" },
                width: "110px",
                "& .MuiOutlinedInput-root": { height: "40px" },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Checkbox
                checked={requireActiveBid}
                onChange={(e) => setRequireActiveBid(e.target.checked)}
                sx={{ color: "gray", p: 0 }}
              />
              <Typography sx={{ fontSize: "13px", color: "white" }}>
                {t("RequireActiveBid")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Checkbox
                checked={isBAMaxEnabled}
                onChange={() => setIsBAMaxEnabled(!isBAMaxEnabled)}
                sx={{ color: "gray" }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography sx={{ fontSize: "13px", color: "white", mt: 0.5 }}>
                  {t("B/AMaxOn/Off")}
                </Typography>
                <Typography sx={{ fontSize: "10px", fontStyle: "italic", color: isBAMaxEnabled ? "white" : "gray" }}>
                  {t("B/AMax(e.g 5 = 5%)")}
                </Typography>
              </Box>
              <TextField
                type="number"
                value={bidAskMax}
                onChange={handleChange}
                onFocus={handleEnableToggle}
                disabled={!isBAMaxEnabled}
                inputProps={{ min: 1, step: 1 }}
                sx={{
                  bgcolor: "#1E1E1E",
                  width: "67px",
                  input: {
                    color: isBAMaxEnabled ? "white" : "gray",
                    padding: "10px 12px",
                    textAlign: "center",
                  },
                  "& .MuiOutlinedInput-root.Mui-disabled .MuiInputBase-input": {
                    color: "gray !important",
                    WebkitTextFillColor: "gray !important",
                  },
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    borderColor: "gray",
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ color: "white", minWidth: "120px" }}>{t("MinContractAsk")}</Typography>
            <TextField
              type="number"
              value={minContractAsk}
              onChange={(e) => setMinContractAsk(Number(e.target.value))}
              inputProps={{ step: 0.01 }}
              sx={{
                bgcolor: "#1E1E1E",
                input: { color: "white", textAlign: "center" },
                width: "100px",
                "& .MuiOutlinedInput-root": { height: "40px" },
              }}
            />
            <Box sx={{ display: "flex",marginLeft:"12px", alignItems: "center", gap: 1 }}>
              <Checkbox
                checked={tradeAsSet}
                onChange={(e) => setTradeAsSet(e.target.checked)}
                sx={{ color: "gray", p: 0 }}
              />
              <Typography sx={{ color: "white" }}>{t("TradeAsSet")}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: "auto",
          bgcolor: "#2A2A2A",
          p: 3,
          borderRadius: 2,
          color: "white",
          marginTop: "25px",
          border: `2px solid ${borderColor}`,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: "10px" }}>
          {t("OptionFilter")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ color: "white" }}>{t("MinOpenInterest")}</Typography>
              <TextField
                type="number"
                value={minOpenInterest}
                onChange={(e) => setMinOpenInterest(Number(e.target.value))}
                sx={{
                  bgcolor: "#1E1E1E",
                  input: { color: "white", textAlign: "center" },
                  width: "100px",
                  "& .MuiOutlinedInput-root": { height: "40px" },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ color: "white" }}>{t("MinVolume")}</Typography>
              <TextField
                type="number"
                value={minVolume}
                onChange={(e) => setMinVolume(Number(e.target.value))}
                sx={{
                  bgcolor: "#1E1E1E",
                  input: { color: "white", textAlign: "center" },
                  width: "100px",
                  "& .MuiOutlinedInput-root": { height: "40px" },
                }}
              />
            </Box>
          </Box>

          <Typography sx={{ color: "white" }}>{t("B/ASpreadDiff")}</Typography>
          <TextField
            type="number"
            value={baSpreadDiff}
            onChange={(e) => setBaSpreadDiff(Number(e.target.value))}
            sx={{
              bgcolor: "#1E1E1E",
              input: { color: "white", textAlign: "center" },
              width: "100px",
              "& .MuiOutlinedInput-root": { height: "40px" },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default OptionSettingsForm;
