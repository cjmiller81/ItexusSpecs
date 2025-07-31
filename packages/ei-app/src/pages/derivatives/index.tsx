import { Box, Typography } from "@mui/material";
import React from "react";

const DerivativesPage: React.FC = () => {
  return (
    <Box>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 0 }}>
          Derivatives
      </Typography>
    </Box>
  );
};

export default DerivativesPage;
