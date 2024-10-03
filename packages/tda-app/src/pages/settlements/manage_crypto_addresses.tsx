import React from "react";
import { useTranslation } from "react-i18next";
import { Grid, Typography } from "@mui/material";

const ManageCryptoAddresses: React.FC = () => {
  const { t } = useTranslation("ManageCryptoAddresses");
  return (
    <>
      <Typography variant="h3">{t("ManageCryptoAddressesTitle")}</Typography>
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

export default ManageCryptoAddresses;
