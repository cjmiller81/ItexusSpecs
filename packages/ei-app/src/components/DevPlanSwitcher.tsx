import { Box, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { DEV_PLAN_PRESETS, DEV_PLAN_STORAGE_KEY } from "components";
import { useState } from "react";

const PRESET_LABELS: Record<string, string> = {
  free:  "Free (0 wallets)",
  basic: "Basic (2 wallets)",
  power: "Power (6 wallets)",
  pro:   "Pro (12 wallets)",
};

export const DevPlanSwitcher = () => {
  const [current, setCurrent] = useState<string>(
    () => localStorage.getItem(DEV_PLAN_STORAGE_KEY) ?? ""
  );

  const handleChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    if (value) {
      localStorage.setItem(DEV_PLAN_STORAGE_KEY, value);
    } else {
      localStorage.removeItem(DEV_PLAN_STORAGE_KEY);
    }
    setCurrent(value);
    window.location.reload();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        backgroundColor: "rgba(30, 30, 40, 0.92)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 2,
        px: 1.5,
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        backdropFilter: "blur(6px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <Typography sx={{ color: "#f59e0b", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em" }}>
        DEV
      </Typography>
      <Select
        size="small"
        displayEmpty
        value={current}
        onChange={handleChange}
        sx={{
          fontSize: "0.75rem",
          color: "white",
          height: 28,
          minWidth: 150,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
          "& .MuiSelect-icon": { color: "rgba(255,255,255,0.5)" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.4)" },
        }}
        MenuProps={{ disablePortal: false }}
      >
        <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
          <em>Real plan (API)</em>
        </MenuItem>
        {Object.keys(DEV_PLAN_PRESETS).map(key => (
          <MenuItem key={key} value={key} sx={{ fontSize: "0.75rem" }}>
            {PRESET_LABELS[key] ?? key}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
