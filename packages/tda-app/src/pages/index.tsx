import { Grid, useMediaQuery } from "@mui/material";
import BalanceWidgetSection from "features/balance-widget/BalanceWidgetSection";

export default function HomePage() {
  const isRelativeBalances = useMediaQuery("(max-width: 1030px)");
  const isStacked = useMediaQuery("(max-width: 950px)");
  const isMobile = useMediaQuery("(max-width: 850px)");

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
            top: isMobile ? 40 : 10,
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
