import SettlementHistorySection from "@/features/settlement-history/SettlementHistorySection";
import { Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const SettlementHistory: React.FC = () => {
  const { t } = useTranslation("SettlementHistory");
  return (
    <>
      <Typography variant="h3">{t("Title")}</Typography>
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
