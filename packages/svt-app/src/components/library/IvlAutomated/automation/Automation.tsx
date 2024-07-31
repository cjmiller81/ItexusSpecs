import React, { useCallback, useEffect, useState } from "react";
import { Box, Checkbox, Button, Grid, Typography, Stack, FormControlLabel } from "@mui/material";

import AutomationTabs from "./tabs";
import PositionTable, { IPositionTableRow } from "./position-table";
import CurrencyInput from "../../InputFields/currency-input";
import { OrderStatus, SvtIvlEsStrategySetStatus } from "../../../../services/tradingPlatformService";

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
  onClosingOnlyChange: (closingOnly: boolean, localOnly: boolean) => void;
  onCapitalAllocationChange: (newCapitalAllocation: number, localOnly: boolean) => void;
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
  const [pendingAutomationResponse, setPendingAutomationResponse] = useState<boolean>(false);
  const [pendingCapitalAllocationResponse, setPendingCapitalAllocationResponse] = useState<boolean>(false);
  const [pendingClosingOnlyResponse, setPendingClosingOnlyResponse] = useState<boolean>(false);
  const [automationRunningLocal, setAutomationRunningLocal] =
    useState<boolean>(false);
    const [closingOnlyLocal, setClosingOnlyLocal] =
      useState<boolean>(false);
  const [capitalError, setCapitalError] = useState<boolean>(false);
  const [capitalErrorMessage, setCapitalErrorMessage] = useState<string>("");
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [localCapitalAllocation, setLocalCapitalAllocation] = React.useState<number>((strategyAccountConnectState?.capitalAllocationNext?.units ?? 0));

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
    setPendingAutomationResponse(true);
    setAutomationRunningLocal(!automationRunning);
    onAutomationRunningChange(!automationRunning);
  }, [automationRunning, onAutomationRunningChange])

  const handleClosingOnlyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setPendingClosingOnlyResponse(true);
    setClosingOnlyLocal(checked);
    onClosingOnlyChange(checked, (strategyAccountConnectState?.capitalAllocation && parseFloat((strategyAccountConnectState?.capitalAllocation?.units ?? 0) as any) > 0) ? false : true);
  }, [onClosingOnlyChange, strategyAccountConnectState?.capitalAllocation])

  const handleCapitalAllocationButton = useCallback(() => {
    setPendingCapitalAllocationResponse(true);
    onCapitalAllocationChange(localCapitalAllocation, false);
  }, [localCapitalAllocation, onCapitalAllocationChange])

  const handleOnEditing = useCallback((isEditing: boolean):void => {
    setIsEditing(isEditing);
  }, []);

  const handleCapitalAllocationChange = useCallback((newCapitalAllocation: number):void => {
    currencyValdiation(newCapitalAllocation);
    if (!(strategyAccountConnectState?.capitalAllocation && parseFloat((strategyAccountConnectState?.capitalAllocation?.units ?? 0) as any) > 0)) {
      onCapitalAllocationChange(newCapitalAllocation, true);
    } else {
      setLocalCapitalAllocation(parseFloat(newCapitalAllocation as any));
    }
  }, [currencyValdiation, onCapitalAllocationChange, strategyAccountConnectState?.capitalAllocation]);

  useEffect(() => {
    if (pendingAutomationResponse) {
      if (automationRunningLocal === automationRunning) {
        setPendingAutomationResponse(false);
      }
    }
  }, [automationRunning, automationRunningLocal, pendingAutomationResponse]);

  useEffect(() => {
    if (pendingCapitalAllocationResponse) {
      if (parseFloat(localCapitalAllocation as any) === parseFloat((strategyAccountConnectState?.capitalAllocationNext?.units ?? 0) as any)) {
        setPendingCapitalAllocationResponse(false);
      }
    }
  }, [localCapitalAllocation, pendingCapitalAllocationResponse, strategyAccountConnectState?.capitalAllocationNext]);

  useEffect(() => {
    if (pendingClosingOnlyResponse) {
      if (closingOnlyLocal === strategyAccountConnectState.closingOnly) {
        setPendingClosingOnlyResponse(false);
      }
    }
  }, [closingOnlyLocal, pendingClosingOnlyResponse, strategyAccountConnectState.closingOnly]);

  useEffect(() => {
    if (
      strategyAccountConnectState.entryExchangeOrderId as string !== "" &&
      strategyAccountConnectState.exitExchangeOrderId as string !== ""
    ) {
      setPositionTableData([
        {
          id: 1,
          orderNumber: strategyAccountConnectState.entryExchangeOrderId as string,
          type: "Entry",
          status: OrderStatus[strategyAccountConnectState.entryOrderStatus as OrderStatus] as string,
          symbol: strategyAccountConnectState.entryOrderSymbol as string,
          qty: (strategyAccountConnectState?.contractQty?.units ?? 0) as number,
        },
        {
          id: 2,
          orderNumber: strategyAccountConnectState.exitExchangeOrderId as string,
          type: "Exit",
          status: OrderStatus[strategyAccountConnectState.exitOrderStatus as OrderStatus] as string,
          symbol: strategyAccountConnectState.exitOrderSymbol as string,
          qty: (strategyAccountConnectState?.contractQty?.units ?? 0) as number,
        },
      ]);
    } else if (strategyAccountConnectState.entryExchangeOrderId as string !== "") {
      setPositionTableData([
        {
          id: 1,
          orderNumber: strategyAccountConnectState.entryExchangeOrderId as string,
          type: "Entry",
          status: OrderStatus[strategyAccountConnectState.entryOrderStatus as OrderStatus] as string,
          symbol: strategyAccountConnectState.entryOrderSymbol as string,
          qty: (strategyAccountConnectState?.contractQty?.units ?? 0) as number,
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
                  !(parseFloat((strategyAccountConnectState?.capitalAllocationNext?.units ?? 0) as any) >= 13000)
                  || pendingAutomationResponse
                  || pendingCapitalAllocationResponse
                  || pendingClosingOnlyResponse
                  || isEditing
                }
                sx={{ mr: 1 }}
              >
                <LoadIndicator
                  id="small-indicator"
                  height={25}
                  width={25}
                  visible={
                    pendingAutomationResponse
                    || pendingCapitalAllocationResponse
                    || pendingClosingOnlyResponse
                  }
                />
                {automationRunning ? "Stop Automation" : "Start Automation"}
              </Button>
              <FormControlLabel
                className="closing-only-container"
                sx={{mt:1}}
                hidden={!automationRunning}
                control={
                  <Checkbox
                    checked={strategyAccountConnectState.closingOnly}
                    onChange={handleClosingOnlyChange}
                    disabled={
                      !automationRunning
                      || pendingAutomationResponse
                      || pendingCapitalAllocationResponse
                      || pendingClosingOnlyResponse
                    }
                    hidden={!automationRunning}
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
                    capitalAllocation={parseFloat(
                        (
                          ((strategyAccountConnectState?.capitalAllocation && parseFloat((strategyAccountConnectState?.capitalAllocation?.units ?? 0) as any) > 0)
                          && parseFloat((strategyAccountConnectState?.capitalAllocationNext?.units ?? 0) as any) === parseFloat((strategyAccountConnectState?.capitalAllocationStart?.units ?? 0) as any))
                            ? localCapitalAllocation
                            : (strategyAccountConnectState?.capitalAllocationNext?.units ?? 0)
                        ) as any
                      )
                    }
                    onEditingChange={handleOnEditing}
                    onBlur={handleCapitalAllocationChange}
                  />
                </Grid>
                <Grid item xs={3} md="auto">
                  { (strategyAccountConnectState?.capitalAllocation && parseFloat((strategyAccountConnectState?.capitalAllocation?.units ?? 0) as any) > 0)
                    ? <Button
                        color={"success"}
                        variant="outlined"
                        onClick={handleCapitalAllocationButton}
                        disabled={
                          pendingAutomationResponse
                          || pendingCapitalAllocationResponse
                          || pendingClosingOnlyResponse
                          || (parseFloat(localCapitalAllocation as any) === parseFloat((strategyAccountConnectState?.capitalAllocationNext?.units ?? 0) as any))
                        }
                        sx={{ mr: 1 }}
                      >
                        <LoadIndicator
                          id="small-indicator"
                          height={25}
                          width={25}
                          visible={
                            pendingAutomationResponse
                            || pendingCapitalAllocationResponse
                            || pendingClosingOnlyResponse
                          }
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
            <AutomationTabs capitalAllocation={parseFloat((strategyAccountConnectState?.capitalAllocation?.units ?? 0) as any)} tabs={tabPanels} />
          </Grid>
        </Grid>
      </Box>
      {/* </div> */}
    </>
  );
};

export default AutomationComponent;
