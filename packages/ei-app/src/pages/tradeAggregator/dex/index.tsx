import { CurrentPositionSection } from "@/features/tradeAggregator/CurrentPositionSection";
import { NewPositionSection } from "@/features/tradeAggregator/NewPositionSection";
import { Box, Grid, Typography } from "@mui/material";

export default function Dex() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h6"
        component="div"
        sx={{
          alignSelf: "flex-start",
          fontSize: "20px",
          width: "100%",
          marginBottom: 2,
        }}
      >
        {"DEX:"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4.5}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: "14px", marginBottom: 1 }}
          >
            {"CurrentPosition"}
          </Typography>
          <CurrentPositionSection />
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: "14px", marginBottom: 1, marginLeft:"17px" }}
          >
            {"NewPosition"}
          </Typography>
          <NewPositionSection/>
        </Grid>
      </Grid>
    </Box>
  );
}
