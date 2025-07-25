import React from "react";
import { ToggleButtonGroup, ToggleButton, Stack, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  isDexEnabled: boolean;
  selectedDexsCount: number;
  maxSelections: number;
  onToggle: (enabled: boolean) => void;
}

const SegmentedDexSwitch: React.FC<Props> = ({
  isDexEnabled,
  selectedDexsCount,
  maxSelections,
  onToggle,
}) => {
  const { t } = useTranslation("NewPositionSection");

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <ToggleButtonGroup
        exclusive
        value={isDexEnabled ? "chooser" : "best"}
        onChange={(_, newValue) => {
          if (newValue === "chooser") onToggle(true);
          if (newValue === "best") onToggle(false);
        }}
        sx={{
          backgroundColor: "action.selected",
          borderRadius: 1,
          overflow: "hidden",
          "& .MuiToggleButton-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            px: 2,
            color: "text.primary",
            "&.Mui-selected": {
              backgroundColor: "#1e88e5",
              color: "#fff",
              borderRadius: "8px", 
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            },
          },
        }}
      >
        <ToggleButton value="best">{t("GetBestRoutes")}</ToggleButton>
        <ToggleButton value="chooser">{t("DEXChooser")}</ToggleButton>
      </ToggleButtonGroup>

      {isDexEnabled && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box display="flex" gap={0.5}>
            {[...Array(maxSelections)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: i < selectedDexsCount ? "primary.main" : "grey.500",
                }}
              />
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {selectedDexsCount}/{maxSelections}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default SegmentedDexSwitch;
