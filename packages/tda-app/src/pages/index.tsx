import { Grid } from "@mui/material";
import BalanceWidgetSection from "features/balance-widget/BalanceWidgetSection";

export default function HomePage() {
  return (
    <Grid
      container
      mt={2}
      spacing={2}
      sx={{ marginTop: 0 }}>
      <Grid
        item
        xs={10}></Grid>
      <Grid
        item
        container
        xs={2}
        direction="column"
        spacing={2}>
        <BalanceWidgetSection
          sx={{
            position: "absolute",
            right: "-70px",
          }}
        />
      </Grid>
    </Grid>
  );
}
