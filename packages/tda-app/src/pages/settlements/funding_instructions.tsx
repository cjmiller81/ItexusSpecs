import React from "react";
import { Grid, Typography } from "@mui/material";

const FundingInstructions: React.FC = () => {
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
          Funding Instructions Page
        </Typography>
      </Grid>
    </Grid>
  );
};

export default FundingInstructions;
