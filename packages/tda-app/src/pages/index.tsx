import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { Grid, Stack, Typography } from "@mui/material";
import { fetchWallets, useOry } from "components";
import { useTranslation } from "react-i18next";
import { CryptoBalance } from "features/dashboard/cryptoBalance";

export default function HomePage() {
  const { session } = useOry();
  const { t } = useTranslation("HomePage");
  const dispatch = useAppDispatch();

  return (
    <>
      <Grid
        mt={2}
        spacing={2}
        container
        sx={{ marginTop: 0 }}>
        <Grid
          xs={10}
          item>
          {/* Other components can be added here */}
        </Grid>
        <Grid
          xs={2}
          item>
          <CryptoBalance />
        </Grid>
      </Grid>
    </>
  );
}
