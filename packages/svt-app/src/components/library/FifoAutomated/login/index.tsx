import { Box, Grid, Icon, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { TastytradeAccountConnect } from "../../../../services/tradingPlatformService";
import { LockPerson } from "@mui/icons-material";

type Props = {
  state: TastytradeAccountConnect;
  onChange: (newLoginState: TastytradeAccountConnect) => void;
  handleStatusUpdate: () => void;
};

export default function Login({ handleStatusUpdate, state, onChange }: Props) {
  const onUsernameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange({
      ...state,
      login: event.target.value,
    });

    handleStatusUpdate();
  }, [handleStatusUpdate, onChange, state]);

  const onPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange({
      ...state,
      password: event.target.value,
    });

    handleStatusUpdate();
  }, [handleStatusUpdate, onChange, state]);

  useEffect(() => {
      handleStatusUpdate();
  }, [handleStatusUpdate, state.login.length, state.password]);

  return (
    <>
      <Box sx={{ marginTop: "30px" }}>
        <Typography
          variant="h6"
          display="block"
          fontSize="h6.fontSize"
          textAlign="left"
          gutterBottom
          color={ "white" }
          sx={{ marginBottom: "20px", fontWeight: "900" }}
        >
          ENTER YOUR TASTYTRADE™ CREDENTIALS TO CONNECT TO THE FIFO TRADING SYSTEM
        </Typography>
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid sx={{ marginBottom: "20px" }} item xs={12}>
                <Typography sx={{ marginBottom: "10px" }}>
                  Tastytrade Username:
                </Typography>
                <TextField
                  hiddenLabel
                  id="outlined-basic"
                  required
                  onChange={onUsernameChange}
                  value={state.login}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ marginBottom: "10px" }}>
                  Tastytrade Password:
                </Typography>
                <TextField
                  hiddenLabel
                  type="password"
                  id="outlined-basic"
                  required
                  onChange={onPasswordChange}
                  value={state.password}
                />
              </Grid>
              <Grid item xs={12}>
                <Icon aria-label="LockPerson" sx={{ marginTop: "20px" }}>
                  <LockPerson sx={{ color: "white" }} />
                </Icon>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ marginTop: "20px" }}>
                  We prioritize the security of your information at Sky View Trading.
                  This connection is encrypted to ensure the confidentiality and
                  integrity of your data. Sky View Trading adheres to stringent security
                  protocols, and as a part of our commitment to your privacy, we do not
                  store any passwords on our servers.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
