import React from "react";
import { Grid, Typography } from "@mui/material";

interface VaultsProps {
  persisKey: string;
}

const Vaults: React.FC<VaultsProps> = ({ persisKey }) => {
  return (
    <Grid
      container
      alignItems="center"
      direction="column"
      mt={2}
      spacing={2}>
      <Grid
        item
        xs={12}>
        <Typography
          variant="h4"
          gutterBottom>
          Vaults Page
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Vaults;
