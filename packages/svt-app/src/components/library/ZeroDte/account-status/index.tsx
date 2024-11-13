import { Divider, Stack } from "@chakra-ui/react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Grid, IconButton, MenuItem, Select, TextField, Typography, styled, useMediaQuery } from "@mui/material";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { UseMutationResult } from "react-query";
import { ExchangeAccount, StrategySettings } from "../../../../services/tradingPlatformService";
import "./AccountStatus.scss";
import { NumberBox } from "devextreme-react";

type Props = {
  membership: string;
  state: ExchangeAccount;
  refreshAccount: UseMutationResult<any, any, void, unknown>;
  handleStatusUpdate: () => void;
  onTradeSymbolChanged: (value: string) => void;
  tradeSymbolOptions: string[];
  tradeSymbolOption: string;
  qty: number;
  existedStrategy?: StrategySettings | null;
  onSettingStrategyChanged : (settings : StrategySettings) => void;
};

const ENTRY_TIME_OPTIONS = [
{  
  key: "Market open",
  value: 0
},
{  
  key: "Market open +14min",
  value: 14
},
{  
  key: "Market open +29min (default)",
  value: 29
},
{  
  key: "Market open +44min",
  value: 44
},
{  
  key: "Market open +59min",
  value: 59
},
{  
  key: "Market open +74min",
  value: 74
},
{  
  key: "Market open +89min",
  value: 89
},
{  
  key: "Market open +104min",
  value: 104
},
{  
  key: "Market open +119min",
  value: 119
},
{  
  key: "Market open +134min",
  value: 134
},
{  
  key: "Market open +149min",
  value: 149
},
{  
  key: "Market open +164min",
  value: 164
},
{  
  key: "Market open +179min",
  value: 179
}];

const EXIT_TIME_OPTIONS  = [
{  
  key: "Market close - 1min",
  value: 1
},
{  
  key: "Market close -30min",
  value: -30
},
{  
  key: "Market close -60min",
  value: -60
},
{  
  key: "Market close -90min (default)",
  value: -90
},
{  
  key: "Market close -120min",
  value: -120
}];

export default function AccountStatus({
  membership,
  state,
  refreshAccount,
  handleStatusUpdate,
  onTradeSymbolChanged,
  tradeSymbolOption,
  tradeSymbolOptions,
  qty,
  onSettingStrategyChanged,
  existedStrategy
}: Props) {
  const onRefresh = useCallback(() => {
    refreshAccount.mutate();
  }, [refreshAccount]);

  const defaultStrategySettings =  {
    entryOrderAtOpenOffsetMinutes: 29,
    exitOrderAtCloseOffsetMinutes: -91,
    maxProfitPercentTarget: 25,
    strikeWidth: 20,
    minCreditRequired: 14.00
  };
  const [currentStrategySettings, setCurrentStrategySettings] = useState<StrategySettings>(existedStrategy ?? defaultStrategySettings);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    handleStatusUpdate();
  }, [handleStatusUpdate, membership, state]);

  useEffect(() => {
    onSettingStrategyChanged(currentStrategySettings);
  }, [currentStrategySettings, onSettingStrategyChanged]);

  useEffect(() => {
    if (existedStrategy) {
      setCurrentStrategySettings(existedStrategy);
    }
  }, [existedStrategy]);

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
            width="100%"
            sx={{
              marginTop: "15px",
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              justifyContent: isSmallScreen ? "center" : "space-between",
              alignItems: "center"
            }}>
            <LabeledStategyOptionField
              label="Entry Time"
              sx={{ width: "50%" }}>
              <Select
                size="small"
                onChange={(e) => {setCurrentStrategySettings({...currentStrategySettings, entryOrderAtOpenOffsetMinutes: e.target.value as number})}}
                value={currentStrategySettings.entryOrderAtOpenOffsetMinutes}
                sx={{ width: isSmallScreen ? "90%" : "95%" }}>
                {ENTRY_TIME_OPTIONS.map(time => (
                  <MenuItem
                    value={time.value}
                    key={time.key}>
                    {time.key}
                  </MenuItem>
                ))}
              </Select>
            </LabeledStategyOptionField>
            <LabeledStategyOptionField
              label="Exit Time"
              sx={{ width: "50%" }}>
              <Select
                size="small"
                onChange={(e) => {setCurrentStrategySettings({...currentStrategySettings, exitOrderAtCloseOffsetMinutes: e.target.value as number})}}
                value={currentStrategySettings?.exitOrderAtCloseOffsetMinutes}
                sx={{ width: isSmallScreen ? "90%" : "95%" }}>
                {EXIT_TIME_OPTIONS.map(time => (
                  <MenuItem
                    value={time.value}
                    key={time.key}>
                    {time.key}
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
              <NumberBox
                width={"100px"}
                height={"40px"}
                stylingMode="outlined"
                min={0}
                max={100}
                step={5}
                defaultValue={currentStrategySettings.maxProfitPercentTarget}
                showSpinButtons={true}
                onValueChange={(value) => setCurrentStrategySettings({...currentStrategySettings, maxProfitPercentTarget: value})}
              />
            </LabeledStategyOptionField>

            <LabeledStategyOptionField
              sx={{ width: { xs: "50%", sm: "30%" } }}
              label={""}>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.85rem", textAlign: isSmallScreen ? "center" : "left" }}>
                Strike Width
              </Typography>
              <NumberBox
                width={"100px"}
                height={"40px"}
                stylingMode="outlined"
                min={5}
                max={50}
                step={1}
                defaultValue={currentStrategySettings.strikeWidth}
                showSpinButtons={true}
                onValueChange={(value) => setCurrentStrategySettings({...currentStrategySettings, strikeWidth: value})}
              />
            </LabeledStategyOptionField>

            <LabeledStategyOptionField
              sx={{ width: { xs: "50%", sm: "30%" } }}
              label={""}>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.85rem", textAlign: isSmallScreen ? "center" : "left" }}>
                Min Credit Required
              </Typography>
              <NumberBox
                width={"115px"}
                height={"40px"}
                stylingMode="outlined"
                min={2}
                max={50}
                step={0.05}
                defaultValue={currentStrategySettings.minCreditRequired}
                showSpinButtons={true}
                onValueChange={(value) => setCurrentStrategySettings({...currentStrategySettings, minCreditRequired: value})}
              />
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
