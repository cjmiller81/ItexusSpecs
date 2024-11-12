import SettlementHistorySection from "@/features/settlement-history/SettlementHistorySection";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const SettlementHistory: React.FC = () => {
  const { t } = useTranslation("SettlementHistory");
  const isPad = useMediaQuery("(max-width: 1030px)");
  const isMobile = useMediaQuery("(max-width: 715px)");
  return (
    <>
      <Typography
        sx={{ mt: isMobile ? "300px" : isPad ? "100px" : "20px" }}
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
