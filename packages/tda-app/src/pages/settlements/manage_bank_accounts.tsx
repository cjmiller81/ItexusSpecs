import React from "react";
import { useTranslation } from "react-i18next";
import { Grid, Typography } from "@mui/material";

const ManageBankAccounts: React.FC = () => {
  const { t } = useTranslation("ManageBankAccounts");
  return (
    <>
      <Typography variant="h3">{t("ManageBankAccountsTitle")}</Typography>
      <Grid
        container
        mt={2}
        spacing={2}>
        <Grid
          item
          xs={12}>
          <div>{/*#########*/}</div>
        </Grid>
      </Grid>
    </>
  );
};

export default ManageBankAccounts;
