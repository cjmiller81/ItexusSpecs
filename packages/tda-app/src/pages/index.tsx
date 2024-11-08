import { Grid, useMediaQuery } from "@mui/material";
import BalanceWidgetSection from "features/balance-widget/BalanceWidgetSection";

export default function HomePage() {
  const isRelativeBalances = useMediaQuery("(max-width: 1030px)");
  const isRelativeBalancesMobile = useMediaQuery("(max-width: 715px)");
  const isStacked = useMediaQuery("(max-width: 950px)");

  return (
    <Grid
      container
      alignItems="center"
      direction={isRelativeBalances ? "column" : "row"}
      mt={2}
      spacing={2}>
      <Grid
        item
        xs={12}>
        <BalanceWidgetSection
          width={theme => (isRelativeBalances ? "100%" : theme.spacing(24))}
          direction={isRelativeBalances ? "row" : "column"}
          sx={{
            top: isRelativeBalancesMobile ? 210 : isRelativeBalances ? 90 : 0,
            position: isStacked ? "relative" : "absolute",
            right: isStacked ? 0 : 30,
            ...(isRelativeBalances && {
              position: "relative",
            }),
          }}
        />
      </Grid>
    </Grid>
  );
}
