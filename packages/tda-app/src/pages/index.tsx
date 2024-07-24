import { Grid } from "@mui/material";
import { CryptoBalance } from "components/CryptoBalance";
import { FiatBalance } from "components/FiatBalance";

export default function HomePage() {
  const mockFiatData = [{ currency: "USD", quantity: "2345000" }];
  const mockCryptoData = [
    { coin: "BTC", quantity: "16000" },
    { coin: "ETH", quantity: "25000" },
    { coin: "USDT", quantity: "22565000" },
  ];

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
        <Grid item>
          <CryptoBalance data={mockCryptoData} />
        </Grid>
        <Grid item>
          <FiatBalance data={mockFiatData} />
        </Grid>
      </Grid>
    </Grid>
  );
}
