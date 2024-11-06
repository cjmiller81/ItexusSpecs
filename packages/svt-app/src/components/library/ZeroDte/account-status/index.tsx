import { Divider, Stack } from "@chakra-ui/react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Grid, IconButton, MenuItem, Select, TextField, Typography, styled, useMediaQuery } from "@mui/material";
import { ReactNode, useCallback, useEffect } from "react";
import { UseMutationResult } from "react-query";
import { ExchangeAccount } from "../../../../services/tradingPlatformService";
import "./AccountStatus.scss";

type Props = {
  membership: string;
  state: ExchangeAccount;
  refreshAccount: UseMutationResult<any, any, void, unknown>;
  handleStatusUpdate: () => void;
  onTradeSymbolChanged: (value: string) => void;
  tradeSymbolOptions: string[];
  tradeSymbolOption: string;
  qty: number;
};

const ENTRY_TIME_OPTIONS = ["9:30 AM", "10:00 AM", "10:30 AM"];
const EXIT_TIME_OPTIONS = ["3:30 PM", "4:00 PM"];

export default function AccountStatus({
  membership,
  state,
  refreshAccount,
  handleStatusUpdate,
  onTradeSymbolChanged,
  tradeSymbolOption,
  tradeSymbolOptions,
  qty,
}: Props) {
  const onRefresh = useCallback(() => {
    refreshAccount.mutate();
  }, [refreshAccount]);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    handleStatusUpdate();
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
            sx={{ marginBottom: "20px", fontWeight: "900" }}>
            Account #: {state.accountNumber}
          </Typography>

          <Typography
            variant="body1"
            sx={{ marginBottom: "20px", fontWeight: "900" }}>
            Your Tastytrade account must meet the following requirements:
          </Typography>

          <Grid container>
            <Grid
              item
              xs={12}>
              <IconButton
                onClick={onRefresh}
                aria-label="delete">
                <RefreshIcon color="info" />
              </IconButton>
            </Grid>
            <Grid
              item
              xs={12}>
              <div className="statusBox">
                <div className="statusName">Membership Status:</div>
                <span>
                  <RadioButtonUncheckedIcon sx={{ color: membership ? "green" : "red" }} />
                </span>
                <span>{membership ? "Member" : "Not A Member"}</span>
              </div>
            </Grid>
            <Grid
              item
              xs={12}>
              <div className="statusBox">
                <div className="statusName">Account Type:</div>
                <span>
                  <RadioButtonUncheckedIcon sx={{ color: state.isMargin ? "green" : "red" }} />
                </span>
                <span>{state.isMargin ? "Margin" : "Not a Margin Account"}</span>
              </div>
            </Grid>
            <Grid
              item
              xs={12}>
              <div className="statusBox">
                <div className="statusName">Suitable Options Level:</div>
                <span>
                  <RadioButtonUncheckedIcon
                    sx={{ color: state.suitableOptionsLevel === "No Restrictions" ? "green" : "red" }}
                  />
                </span>
                <span>{state.suitableOptionsLevel === "No Restrictions" ? "No Restrictions" : "Restricted"}</span>
              </div>
            </Grid>
          </Grid>
        </AdaptiveSideBox>
        <Stack
          alignItems="center"
          width="10%">
          <Divider
            borderColor="#757575"
            marginLeft="auto"
            marginRight="auto"
            height="100%"
            orientation="vertical"
          />
        </Stack>

        <AdaptiveSideBox
          alignItems="center"
          width="45%">
          <Typography
            variant="button"
            display="block"
            fontSize="h6.fontSize"
            textAlign="left"
            gutterBottom
            sx={{ marginBottom: "20px", fontWeight: "900" }}>
            0DTE Strategy Instrument Settings
          </Typography>
          <Stack
            sx={{ width: isSmallScreen ? "100%" : "80%" }}
            direction="row"
            spacing={2}>
            <LabeledStategyOptionField
              label="Trade Symbol"
              sx={{ width: "50%" }}>
              <Select
                onChange={event => onTradeSymbolChanged(event.target.value)}
                value={tradeSymbolOption}
                sx={{ width: "90% !important" }}
                size="small">
                {tradeSymbolOptions.map(option => (
                  <MenuItem
                    value={option}
                    key={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </LabeledStategyOptionField>
            <LabeledStategyOptionField
              label="Trade Qty"
              sx={{ width: "50%" }}>
              <TextField
                sx={{ width: "90%" }}
                disabled
                size="small"
                value={qty}
                className="trade-qty-input"
              />
            </LabeledStategyOptionField>
          </Stack>

          <Typography
            variant="h6"
            sx={{ marginTop: "20px", fontWeight: "bold" }}>
            0DTE PARAMETER SETTINGS
          </Typography>

          <Stack
            direction="row"
            sx={{ mt: 2, width: isSmallScreen ? "100%" : "80%" }}>
            <LabeledStategyOptionField
              label="Entry Time"
              sx={{ width: "50%" }}>
              <Select
                size="small"
                sx={{ width: isSmallScreen ? "90%" : "80%" }}>
                {ENTRY_TIME_OPTIONS.map(time => (
                  <MenuItem
                    value={time}
                    key={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </LabeledStategyOptionField>
            <LabeledStategyOptionField
              label="Exit Time"
              sx={{ width: "50%" }}>
              <Select
                size="small"
                sx={{ width: isSmallScreen ? "90%" : "80%" }}>
                {EXIT_TIME_OPTIONS.map(time => (
                  <MenuItem
                    value={time}
                    key={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </LabeledStategyOptionField>
          </Stack>

          <Stack
            direction={isSmallScreen ? "column" : "row"}
            spacing={2}
            width="100%"
            sx={{
              marginTop: "15px",
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              justifyContent: isSmallScreen ? "center" : "space-between",
              alignItems: "center",
              flexWrap: "nowrap",
              gap: 5,
            }}>
            <LabeledStategyOptionField
              sx={{ width: { xs: "50%", sm: "30%" } }}
              label={""}>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.85rem", textAlign: isSmallScreen ? "center" : "left" }}>
                Max Profit % Target
              </Typography>
              <TextField size="small" />
            </LabeledStategyOptionField>

            <LabeledStategyOptionField
              sx={{ width: { xs: "50%", sm: "30%" } }}
              label={""}>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.85rem", textAlign: isSmallScreen ? "center" : "left" }}>
                Strike Width
              </Typography>
              <TextField size="small" />
            </LabeledStategyOptionField>

            <LabeledStategyOptionField
              sx={{ width: { xs: "50%", sm: "30%" } }}
              label={""}>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.85rem", textAlign: isSmallScreen ? "center" : "left" }}>
                Min Credit Required
              </Typography>
              <TextField size="small" />
            </LabeledStategyOptionField>
          </Stack>
        </AdaptiveSideBox>
      </AdaptiveContainer>
    </>
  );
}

export const AdaptiveContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  marginTop: "30px",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));

export const AdaptiveSideBox = styled(Box)(({ theme }) => ({
  width: "45%",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

function LabeledStategyOptionField({ label, children, sx }: { label: string; children: ReactNode; sx?: object }) {
  return (
    <Stack
      sx={{ ...sx }}
      gap={0}>
      <Typography
        variant="caption"
        sx={{ fontSize: "0.85rem" }}>
        {label}
      </Typography>
      {children}
    </Stack>
  );
}
