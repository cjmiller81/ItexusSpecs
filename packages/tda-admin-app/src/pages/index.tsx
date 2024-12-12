import { Grid, useMediaQuery } from "@mui/material";

export default function HomePage() {
  const isRelativeBalances = useMediaQuery("(max-width: 1030px)");

  return (
    <Grid
      container
      alignItems="center"
      direction={isRelativeBalances ? "column" : "row"}
      mt={2}
      spacing={2}></Grid>
  );
}
