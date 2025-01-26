import SettlementHistorySection from "@/features/settlement-history/SettlementHistorySection";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const SettlementHistory: React.FC = () => {
  const { t } = useTranslation("SettlementHistory");
  const isMobile = useMediaQuery("(max-width: 850px)");
  return (
    <>
      <Typography
        sx={{ mt: isMobile ? "70px" : "20px" }}
        variant="h3">
        {t("Title")}
      </Typography>
      <Grid
        container
        mt={2}
        spacing={2}>
        <Grid
          item
          xs={12}>
          <SettlementHistorySection />
        </Grid>
      </Grid>
    </>
  );
};

export default SettlementHistory;
