import React from "react";
import { ToggleButtonGroup, ToggleButton, Stack, Box, Typography, Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
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

  const infoTexts = {
  best: (
    <>
      <Typography variant="subtitle1" fontWeight={700} mb={1}>
        {t("BestRoutes")}
      </Typography>
      <Typography variant="body2" mb={0.5}>
        {t("AutomaticallyDiscovers")}
      </Typography>
      <Typography variant="body2">{t("ConsidersPriceImpact")}</Typography>
      <Typography variant="body2">{t("RealTimeMarketOptimization")}</Typography>
    </>
  ),
  chooser: (
    <>
      <Typography variant="subtitle1" fontWeight={700} mb={1}>
        {t("DEXChooserWithIcon")}
      </Typography>
      <Typography variant="body2" mb={0.5}>
        {t("SelectUpToSpecificDEXs")}
        {t("ChosenExchangesRankedByPerformance")}
      </Typography>      
      <Typography variant="body2">{t("TargetedDEXComparison")}</Typography>
      <Typography variant="body2">{t("SideBySidePerformanceAnalysis")}</Typography>
    </>
  ),
};

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="column" alignItems="center" spacing={0.5}>
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

        <Stack direction="row" spacing={12}>
          <Tooltip
            title={infoTexts.best}
            placement="bottom"
            arrow
            componentsProps={{
              tooltip: { sx: { maxWidth: 320, p: 2, border: "2px solid #1e88e5", borderRadius: 2 } },
            }}
          >
            <IconButton size="small" sx={{ color: "#1e88e5" }} aria-label="info best routes">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={infoTexts.chooser}
            placement="bottom"
            arrow
            componentsProps={{
              tooltip: { sx: { maxWidth: 320, p: 2, border: "2px solid #1e88e5", borderRadius: 2 } },
            }}
          >
            <IconButton size="small" sx={{ color: "#1e88e5" }} aria-label="info dex chooser">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

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
