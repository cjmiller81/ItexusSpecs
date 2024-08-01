import { Grid, useMediaQuery } from "@mui/material";
import BalanceWidgetSection from "features/balance-widget/BalanceWidgetSection";

export default function HomePage() {
  const isRelativeBalances = useMediaQuery("(max-width: 1070px)");

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
        <BalanceWidgetSection
          width={theme => (isRelativeBalances ? "100%" : theme.spacing(24))}
          direction={isRelativeBalances ? "row" : "column"}
          sx={{
            top: 0,
            position: "absolute",
            right: 0,
            ...(isRelativeBalances && {
              position: "relative",
            }),
          }}
        />
      </Grid>
    </Grid>
  );
}
