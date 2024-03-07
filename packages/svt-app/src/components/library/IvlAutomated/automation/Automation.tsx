import React, { useCallback, useEffect, useState } from "react";
import { Box, Checkbox, Button, Grid, Typography, Stack, FormControlLabel } from "@mui/material";

import AutomationTabs from "./tabs";
import PositionTable, { IPositionTableRow } from "./position-table";
import CurrencyInput from "../../InputFields/currency-input";
import { SvtIvlEsStrategySetStatus } from "../../../../services/tradingPlatformService";

import "./Automation.scss";
import { LoadIndicator } from "devextreme-react";

export interface TabPanel {
  value: string;
  label: string;
  component?: any;
}

interface AutomationComponentProps {
  strategyAccountConnectState: SvtIvlEsStrategySetStatus;
  automationRunning: boolean;
  onAutomationRunningChange: (newAutomationRunning: boolean) => void;
  onClosingOnlyChange: (closingOnly: boolean) => void;
  onCapitalAllocationChange: (newCapitalAllocation: number) => void;
  errorMessage: string;
}

const AutomationComponent: React.FC<AutomationComponentProps> = ({
  strategyAccountConnectState,
  automationRunning,
  onAutomationRunningChange,
  onClosingOnlyChange,
  onCapitalAllocationChange,
  errorMessage,
}: AutomationComponentProps) => {
  const [positionTableData, setPositionTableData] = useState<
    IPositionTableRow[]
  >([]);
  const [pendingResponse, setPendingResponse] = useState<boolean>(false);
  const [automationRunningLocal, setAutomationRunningLocal] =
    useState<boolean>(false);
    const [closingOnlyLocal, setClosingOnlyLocal] =
      useState<boolean>(false);
  const [capitalError, setCapitalError] = useState<boolean>(false);
  const [capitalErrorMessage, setCapitalErrorMessage] = useState<string>("");
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [localCapitalAllocation, setLocalCapitalAllocation] = React.useState<number>(strategyAccountConnectState?.capitalAllocationNext);

  const tabPanels: TabPanel[] = [
    {
      value: "position",
      label: "Position",
      component: <PositionTable data={positionTableData} />,
    },
    /*
    {
      value: "orderHistory",
      label: "Order History",
    },
    {
      value: "performance",
      label: "Performance",
    },
    */
  ];

  const currencyValdiation = useCallback((e: number):boolean => {
    if (e < 13000) {
      setCapitalErrorMessage(
        "This strategy automation requires a minimum allocation value of $13,000."
      );
      setCapitalError(true);
      return false;
    } else {
      setCapitalErrorMessage("");
      setCapitalError(false);
      return true;
    }
  }, []);

  const handleAutomationRunningChange = useCallback(() => {
    setPendingResponse(true);
    setAutomationRunningLocal(automationRunning);
    onAutomationRunningChange(!automationRunning);
  }, [automationRunning, onAutomationRunningChange])

  const handleClosingOnlyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setPendingResponse(true);
    setClosingOnlyLocal(checked);
    onClosingOnlyChange(checked);
  }, [onClosingOnlyChange])

  const handleCapitalAllocationButton = useCallback(() => {
    setPendingResponse(true);
    onCapitalAllocationChange(localCapitalAllocation);
  }, [localCapitalAllocation, onCapitalAllocationChange])

  const handleOnEditing = useCallback((isEditing: boolean):void => {
    setIsEditing(isEditing);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setLocalCapitalAllocation(parseFloat(strategyAccountConnectState?.capitalAllocationNext as any));
    }
    currencyValdiation(strategyAccountConnectState?.capitalAllocationNext);
  }, [currencyValdiation, isEditing, strategyAccountConnectState?.capitalAllocationNext]);

  useEffect(() => {
    if (pendingResponse) {
      setPendingResponse(false);
      if (automationRunningLocal !== automationRunning) {
        setAutomationRunningLocal(automationRunning);
      }
      if (closingOnlyLocal !== strategyAccountConnectState.closingOnly) {
        setClosingOnlyLocal(strategyAccountConnectState.closingOnly);
      }
    }
  }, [automationRunning, automationRunningLocal, closingOnlyLocal, pendingResponse, strategyAccountConnectState.closingOnly]);

  useEffect(() => {
    if (
      strategyAccountConnectState.entryOrderId &&
      strategyAccountConnectState.exitOrderId
    ) {
      setPositionTableData([
        {
          id: 1,
          orderNumber: strategyAccountConnectState.entryOrderId,
          type: "Entry",
          status: strategyAccountConnectState.entryOrderStatus,
          symbol: strategyAccountConnectState.exitOrderSymbol as string,
          qty: strategyAccountConnectState.contractQty as number,
        },
        {
          id: 2,
          orderNumber: strategyAccountConnectState.exitOrderId,
          type: "Exit",
          status: strategyAccountConnectState.exitOrderStatus,
          symbol: strategyAccountConnectState.exitOrderSymbol as string,
          qty: strategyAccountConnectState.contractQty as number,
        },
      ]);
    } else if (strategyAccountConnectState.entryOrderId) {
      setPositionTableData([
        {
          id: 1,
          orderNumber: strategyAccountConnectState.entryOrderId,
          type: "Entry",
          status: strategyAccountConnectState.entryOrderStatus,
          symbol: strategyAccountConnectState.exitOrderSymbol as string,
          qty: strategyAccountConnectState.contractQty as number,
        },
      ]);
    } else {
      setPositionTableData([]);
    }
  }, [strategyAccountConnectState]);

  return (
    <>
      <Box>
        <Grid container className="automationHeader">
          <Grid item xs={12} md={9}>
            <Typography
              variant="button"
              display="block"
              fontWeight="bold"
              fontSize="h5.fontSize"
              textAlign="left"
              gutterBottom
            >
              Account #: {strategyAccountConnectState.accountNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} md="auto">
            <Stack>
              <Button
                color={automationRunning ? "error" : "success"}
                variant="outlined"
                onClick={handleAutomationRunningChange}
                disabled={
                  !(strategyAccountConnectState.capitalAllocationNext >= 13000)
                  || pendingResponse
                  || isEditing
                }
                sx={{ mr: 1 }}
              >
                <LoadIndicator
                  id="small-indicator"
                  height={25}
                  width={25}
                  visible={pendingResponse}
                />
                {automationRunning ? "Stop Automation" : "Start Automation"}
              </Button>
              <FormControlLabel
                className="closing-only-container"
                sx={{mt:1}}
                control={
                  <Checkbox
                  checked={strategyAccountConnectState.closingOnly}
                  onChange={handleClosingOnlyChange}
                  />
                }
                label="Closing Only"
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            {errorMessage.length > 0 ? (
              <span className="errorMessage">{errorMessage}</span>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Box sx={{ marginBottom: "30px" }}>
              <Typography variant="caption">
                Next Entry's Capital Allocation:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3} md="auto">
                  <CurrencyInput
                    error={capitalError}
                    errorMessage={capitalErrorMessage}
                    disabled={false}
                    capitalAllocation={
                      (strategyAccountConnectState?.capitalAllocation > 0
                      && strategyAccountConnectState?.capitalAllocationNext === strategyAccountConnectState?.capitalAllocationStart)
                        ? localCapitalAllocation
                        : strategyAccountConnectState?.capitalAllocationNext
                    }
                    onEditingChange={handleOnEditing}
                  />
                </Grid>
                <Grid item xs={3} md="auto">
                  { strategyAccountConnectState?.capitalAllocation > 0
                    ? <Button
                        color={"success"}
                        variant="outlined"
                        onClick={handleCapitalAllocationButton}
                        disabled={ pendingResponse }
                        sx={{ mr: 1 }}
                      >
                        <LoadIndicator
                          id="small-indicator"
                          height={25}
                          width={25}
                          visible={pendingResponse}
                        />
                        { "Update" }
                      </Button>
                    : <></>
                  }
                </Grid>
              </Grid>
              <Box>
                <Typography variant="caption">
                  IMPORTANT:
                  <br />
                  Please ensure that the amount you assign to this strategy
                  aligns with your desired trading allocation for the
                  automation. This designated amount will be used to determine
                  your position sizing. It is crucial that this allocation
                  amount does not exceed the available free capital within your
                  account.
                  <br />
                  For example, if your account value is $100,000, with $60,000
                  already invested in stocks, your available FREE CAPITAL
                  amounts to $40,000 (regardless of what your available buying
                  power is). Therefore, you can allocate a maximum of $40,000 to
                  the automation.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <AutomationTabs capitalAllocation={strategyAccountConnectState?.capitalAllocation} tabs={tabPanels} />
          </Grid>
        </Grid>
      </Box>
      {/* </div> */}
    </>
  );
};

export default AutomationComponent;
