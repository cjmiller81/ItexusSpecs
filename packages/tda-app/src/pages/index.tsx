import { Grid, useMediaQuery } from "@mui/material";
import BalanceWidgetSection from "features/balance-widget/BalanceWidgetSection";

export default function HomePage() {
  const isRelativeBalances = useMediaQuery("(max-width: 1030px)");
  const isRelativeBalancesMobile = useMediaQuery("(max-width: 715px)");
  const isStacked = useMediaQuery("(max-width: 950px)"); // New media query for 550px

  return (
    <Grid
      container
      alignItems="center"
      direction={isRelativeBalances ? "column" : "row"} // Adjust direction based on the new media query
      mt={2}
      spacing={2}>
      <Grid
        item
        xs={12}>
        <BalanceWidgetSection
          width={theme => (isRelativeBalances ? "100%" : theme.spacing(24))}
          direction={isRelativeBalances ? "row" : "column"}
          sx={{
            top: isRelativeBalancesMobile ? 270 : isRelativeBalances ? 80 : 0,
            position: isStacked ? "relative" : "absolute", // Adjust position based on the new media query
            right: isStacked ? 0 : 30, // Align widgets correctly when stacked
            ...(isRelativeBalances && {
              position: "relative",
            }),
          }}
        />
      </Grid>
    </Grid>
  );
}
