import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Grid, IconButton, MenuItem, Select, TextField, Typography, styled, useMediaQuery } from "@mui/material";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { UseMutationResult } from "react-query";
import { ExchangeAccount } from "../../../../services/tradingPlatformService";
import { Divider, Stack } from "@chakra-ui/react";
import "./AccountStatus.scss";

type Props = {
  membership: string;
  state: ExchangeAccount;
  refreshAccount: UseMutationResult<any, any, void, unknown>;
  handleStatusUpdate: () => void;
  onFifoFeedChanged: (value: string) => void
  fifoFeed: string
  onTradingSymbolChanged: (value: string) => void
  tradeSymbolOptions: string[]
  fifiFeedOptions: string[]
  tradeSymbolOption: string
  qty: number
};

export default function AccountStatus({ membership,
  state,
  refreshAccount,
  handleStatusUpdate,
  onFifoFeedChanged,
  fifoFeed,
  onTradingSymbolChanged,
  tradeSymbolOption,
  tradeSymbolOptions,
  fifiFeedOptions,
  qty}: Props) {
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
    <AdaptiveContainer>
      <AdaptiveSideBox>
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
      </AdaptiveSideBox>
      <Stack alignItems="center" width="10%">
        <Divider borderColor="#757575" marginLeft="auto" marginRight="auto" height="100%" orientation="vertical" />
      </Stack>
      
      <AdaptiveSideBox alignItems="center" width="45%">
        <Typography
          variant="button"
          display="block"
          fontSize="h6.fontSize"
          textAlign="left"
          gutterBottom
          sx={{ marginBottom: "20px", fontWeight: "900" }}
        >
          FIFO Strategy Instrument Settings
        </Typography>
        <Stack gap={5} width="40%">
        <LabeledStategyOptionField label="FIFO Feed">
          <Select onChange={event => onFifoFeedChanged(event.target.value)} value={fifoFeed} size="small">
            {
              fifiFeedOptions.map(option => (<MenuItem value={option}>{option}</MenuItem>))
            }
          </Select>
        </LabeledStategyOptionField>

        <LabeledStategyOptionField label="Trade Symbol">
          <Select onChange={event => onTradingSymbolChanged(event.target.value)} value={tradeSymbolOption} size="small">
            {
              tradeSymbolOptions.map(option => (<MenuItem value={option}>{option}</MenuItem>))
            }
          </Select>
        </LabeledStategyOptionField>
        <LabeledStategyOptionField label="Trade Qty">
          <TextField disabled size="small" value={qty}></TextField>
        </LabeledStategyOptionField>
        </Stack>
      </AdaptiveSideBox>
    </AdaptiveContainer>
    </>
  );
}

export const AdaptiveContainer = styled(Box)(({theme}) => ({
  display: "flex",
  flexDirection: "row",
  marginTop: "30px",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: theme.spacing(2)
  },
}))

export const AdaptiveSideBox = styled(Box)(({theme}) => ({
  width: "45%",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}))

function LabeledStategyOptionField({
  label,
  children
}:{
  label: string,
  children: ReactNode
})
{
  return(
    <Stack gap={0}>
      <Typography
        variant="caption"
      >
        {label}
      </Typography>
        {children}
    </Stack>
  )
}