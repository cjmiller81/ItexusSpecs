import React, { useCallback, useEffect } from "react";
import { UseMutationResult } from "react-query";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RefreshIcon from "@mui/icons-material/Refresh";

import { ExchangeAccount } from "../../../../services/tradingPlatformService";

import "./AccountStatus.scss";

type Props = {
  membership: string;
  state: ExchangeAccount;
  refreshAccount: UseMutationResult<any, any, void, unknown>;
  handleStatusUpdate: () => void;
};

export default function AccountStatus({ membership, state, refreshAccount, handleStatusUpdate }: Props) {
  const onRefresh = useCallback(() => {
    refreshAccount.mutate();
  }, [refreshAccount]);

  useEffect(() => {
    if (membership && state) {
      handleStatusUpdate();
    } else {
      handleStatusUpdate();
    }
  }, [handleStatusUpdate, membership, state]);

  return (
    <>
      <Box sx={{ marginTop: "30px" }}>
        <Typography
          variant="button"
          display="block"
          fontSize="h6.fontSize"
          textAlign="left"
          gutterBottom
          sx={{ marginBottom: "20px", fontWeight: "900" }}
        >
          Account #: {state.accountNumber}
        </Typography>

        <Typography
          variant="body1"
          sx={{ marginBottom: "20px", fontWeight: "900" }}
        >
          Your Tastytrade account must meet the following requirements:
        </Typography>

        <Grid container>
          <Grid item xs={12}>
            <IconButton
              onClick={onRefresh}
              aria-label="delete"
            >
              <RefreshIcon color="info" />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <div className="statusBox">
              <div className="statusName">Membership Status:</div>
              <span>
                <RadioButtonUncheckedIcon
                  sx={{ color: membership ? "green" : "red" }}
                />
              </span>
              <span>{ membership ? "Member" : "Not A Member" }</span>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="statusBox">
              <div className="statusName">Account Type:</div>
              <span>
                <RadioButtonUncheckedIcon
                  sx={{ color: state.isMargin ? "green" : "red" }}
                />
              </span>
              <span>{ state.isMargin ? "Margin" : "Not a Margin Account" }</span>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="statusBox">
              <div className="statusName">Suitable Options Level:</div>
              <span>
                <RadioButtonUncheckedIcon
                  sx={{ color: state.suitableOptionsLevel === "No Restrictions" ? "green" : "red" }}
                />
              </span>
              <span>{ state.suitableOptionsLevel === "No Restrictions" ? "No Restrictions" : "Restricted" }</span>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="statusBox">
              <div className="statusName">Futures Trading:</div>
              <span>
                <RadioButtonUncheckedIcon
                  sx={{ color: state.isFuturesApproved ? "green" : "red" }}
                />
              </span>
              <span>{ state.isFuturesApproved ? "Approved" : "Not Approved" }</span>
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
