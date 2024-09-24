import * as React from "react";
import { useCallback, useEffect, useState } from "react";

import { Settings } from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { v4 as uuid } from "uuid";
import {
  ExchangeAccount,
  IvlRiskTolerance,
  SvtIvlEsStrategySetStatus,
  TastytradeAccountConnect,
  useCreateZeroDteStrategy,
  useDeleteZeroDteStrategy,
  useGetAccountList,
  useGetZeroDteStrategy,
  useUpsertTastytradeConnection,
  useZeroDteStartStrategy,
  useZeroDteStopStrategy,
  ZeroDteFlyStrategyListResponse,
} from "../../../services/tradingPlatformService";
import { useInterval } from "../../../utils";
import AccountStatus from "./account-status";
import Accounts from "./accounts";
import { IPositionTableRow } from "./automation/position-table";
import ZeroDteComponent from "./automation/ZeroDte";
import Login from "./login";
import "./ZeroDte.scss";

const steps = ["Select Account", "Account Status / Settings"];

const tradeSymbolOptions = [
  "SPX",
];

interface IState {
  loginSubmitted: boolean;
  accountSelectionSubmitted: boolean;
  accountStatus: boolean;
}

export default function ZeroDte() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [automationRunning, setAutomationRunning] = React.useState(false);
  const [initConfiguring, setInitConfiguring] = React.useState(true);
  const [configuring, setConfiguring] = React.useState(true);
  const [enabled, setEnabled] = React.useState(false);
  const [mutating, setMutating] = React.useState(false);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [errorMessage, setErrorMessage] = React.useState("");

  const [state, setState] = React.useState<IState>({
    loginSubmitted: false,
    accountSelectionSubmitted: false,
    accountStatus: false,
  });
  const [membership, setMembership] = React.useState<string>("TODO");
  const [loginState, setloginState] = React.useState<TastytradeAccountConnect>({
    login: "",
    password: "",
    rememberToken: null,
    epdCustomerId: null,
    stripeCustomerId: null,
  } as TastytradeAccountConnect);
  const [tableData, setTableData] = React.useState<ExchangeAccount[]>([] as ExchangeAccount[]);
  const [exchangeAccountState, setExchangeAccountState] = React.useState<ExchangeAccount>({
    accountBalance: {
      units: 0,
      nanos: 0,
    },
    accountName: "",
    accountNumber: "",
    authorityLevel: "",
    isClosed: false,
    isFuturesApproved: false,
    isMargin: false,
    isPrimary: false,
    suitableOptionsLevel: "",
  } as ExchangeAccount);

  const [strategyAccountConnectState, setStrategyAccountConnectState] = React.useState<SvtIvlEsStrategySetStatus>({
    accountNumber: "",
    riskTolerance: IvlRiskTolerance.High,
    capitalAllocationStart: {
      units: 0,
      nanos: 0,
    },
    capitalAllocationNext: {
      units: 0,
      nanos: 0,
    },
    closingOnly: false,
  } as SvtIvlEsStrategySetStatus);

  const [fifoFeedOption, setFifoFeedOption] = useState("SP 500");
  const [tradeSymbolOption, setTradeSymbolOption] = useState("SPX");
  const qty = tradeSymbolOption === "SPX" ? 1 : 100;
  const [positionTableData, setPositionTableData] = useState<IPositionTableRow[]>([]);

  const isDesktop = useMediaQuery("(min-width:800px)");

  const totalSteps = () => {
    return steps.length + 1;
  };

  const completedSteps = useCallback(() => {
    return Object.keys(completed).length;
  }, [completed]);

  const isLastStep = useCallback(() => {
    return activeStep === totalSteps() - 1;
  }, [activeStep]);

  const allStepsCompleted = useCallback(() => {
    return completedSteps() === totalSteps();
  }, [completedSteps]);

  // Action to update the state of an indicator
  const setStatus = useCallback((statusName: keyof IState, state: boolean) => {
    setState(prevstatus => ({
      ...prevstatus,
      [statusName]: state,
    }));
  }, []);

  const isLoginValid = useCallback((): boolean => {
    if (
      loginState.login.length > 0 &&
      exchangeAccountState !== null &&
      exchangeAccountState.accountNumber &&
      exchangeAccountState.accountNumber.length > 0
    ) {
      return true;
    } else if (loginState.login.length > 0 && positionTableData && positionTableData.length > 0) {
      return true;
    } else if (loginState.login.length > 0 && loginState.password !== null && loginState.password?.length > 0) {
      return true;
    }

    return false;
  }, [exchangeAccountState, loginState.login.length, loginState.password, positionTableData]);

  const isAccountNumberValid = useCallback((): boolean => {
    return strategyAccountConnectState.accountNumber ? strategyAccountConnectState.accountNumber.length > 0 : false;
  }, [strategyAccountConnectState]);

  const isExchangeAccountValid = useCallback((): boolean => {
    return (
      membership === "TODO" &&
      !exchangeAccountState.isClosed &&
      exchangeAccountState.isMargin &&
      exchangeAccountState.suitableOptionsLevel === "No Restrictions"
    );
  }, [exchangeAccountState, membership]);

  const enableNext = useCallback((): void => {
    setEnabled(false);
    if (activeStep === 0 && isLoginValid()) {
      setEnabled(true);
    } else if (activeStep === 1 && isLoginValid() && isAccountNumberValid()) {
      setEnabled(true);
    } else if (activeStep === 2 && isLoginValid() && isAccountNumberValid() && isExchangeAccountValid()) {
      setEnabled(true);
    }
  }, [activeStep, isAccountNumberValid, isExchangeAccountValid, isLoginValid]);

  const handleLoginChange = useCallback(
    (newLoginState: TastytradeAccountConnect): void => {
      if (newLoginState.login !== loginState.login) {
        setStatus("loginSubmitted", false);
        setStatus("accountSelectionSubmitted", false);
        setStatus("accountStatus", false);
      }
      setloginState(newLoginState);
    },
    [loginState.login, setStatus],
  );

  const handleAccountSelected = useCallback(
    (newExchangeAccountState: ExchangeAccount): void => {
      if (newExchangeAccountState.accountNumber !== strategyAccountConnectState.accountNumber) {
        setStatus("accountSelectionSubmitted", false);
        setStatus("accountStatus", false);
      }

      setExchangeAccountState(newExchangeAccountState);
      setStrategyAccountConnectState({
        ...strategyAccountConnectState,
        accountNumber: newExchangeAccountState.accountNumber,
      });
      enableNext();
    },
    [enableNext, setStatus, strategyAccountConnectState],
  );

  const handleExchangeAccount = useCallback(
    (newMembership: string, newExchangeAccountState: ExchangeAccount): void => {
      if (
        newMembership !== membership ||
        newExchangeAccountState.isClosed !== exchangeAccountState.isClosed ||
        newExchangeAccountState.isFuturesApproved !== exchangeAccountState.isFuturesApproved ||
        newExchangeAccountState.isMargin !== exchangeAccountState.isMargin
      ) {
        setStatus("accountStatus", false);
      }
      setMembership(newMembership);
      setExchangeAccountState(newExchangeAccountState);
      enableNext();

      if (initConfiguring && activeStep === 0 && isLoginValid() && isAccountNumberValid() && isExchangeAccountValid()) {
        setInitConfiguring(false);
        setConfiguring(false);
      }
    },
    [
      activeStep,
      enableNext,
      exchangeAccountState.isClosed,
      exchangeAccountState.isFuturesApproved,
      exchangeAccountState.isMargin,
      initConfiguring,
      isAccountNumberValid,
      isExchangeAccountValid,
      isLoginValid,
      membership,
      setStatus,
    ],
  );

  const handleSettingsClicked = useCallback(() => {
    setConfiguring(true);
    setActiveStep(0);
  }, []);

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      if (exchangeAccountState && exchangeAccountState.accountNumber.length > 0) {
        const selectedAccount = tableData.find(row => row.accountNumber === exchangeAccountState.accountNumber);
        if (selectedAccount) {
          handleExchangeAccount(membership, selectedAccount);
        }
      } else if (
        strategyAccountConnectState &&
        strategyAccountConnectState.accountNumber &&
        strategyAccountConnectState.accountNumber.length > 0
      ) {
        const selectedAccount = tableData.find(row => row.accountNumber === strategyAccountConnectState.accountNumber);
        if (selectedAccount) {
          handleExchangeAccount(membership, selectedAccount);
        }
      }
    }
  }, [tableData, exchangeAccountState, strategyAccountConnectState, handleExchangeAccount, membership]);

  const getStrategies = useGetZeroDteStrategy({
    onSuccess: (res: ZeroDteFlyStrategyListResponse) => {
      const newItems = res.zeroDteFlyStrategyList.map<IPositionTableRow>(listItem => ({
        id: uuid(),
        account: listItem.exchangeAccountNumber,
        fifoFeed: "SP 500",
        tradeQty: listItem.tradeQty.units,
        status: listItem.active ? "Running" : "Suspended",
        tradeSymbol: listItem.masterSymbol,
      }));
      setPositionTableData(newItems);

      if (newItems && newItems.length > 0 && initConfiguring && activeStep === 0 && isLoginValid()) {
        setStrategyAccountConnectState({
          ...strategyAccountConnectState,
          accountNumber: newItems[0].account,
        });
        setInitConfiguring(false);
        setConfiguring(false);
        setAutomationRunning(newItems[0].status === "Running");
      }

      if (activeStep === 0 && newItems.length) {
        setActiveStep(2);
        setConfiguring(false);
        setStrategyAccountConnectState({
          ...strategyAccountConnectState,
          accountNumber: newItems[0].account,
        });
        setAutomationRunning(newItems[0].status === "Running");
      }
      setMutating(false);
    },
    onError: (res: any) => {
      console.error("useGetFifoStrategy", res);
    },
  });

  const getAccountList = useGetAccountList({
    onSuccess: useCallback(
      (res: ExchangeAccount[] | unknown) => {
        if (res && (res as ExchangeAccount[])) {
          const accountList = res as ExchangeAccount[];
          if (accountList && accountList.length > 0 && accountList[0].exchangeUsername.length > 0) {
            setloginState({
              ...loginState,
              login: accountList[0].exchangeUsername,
            });

            setStatus("loginSubmitted", true);
            setStatus("accountSelectionSubmitted", true);
            setStatus("accountStatus", true);

            setTableData(accountList);
          }

          getStrategies.mutate();
        } else {
          setMutating(false);
        }
      },
      [getStrategies, loginState, setStatus],
    ),
    onError: (res: any) => {
      setMutating(false);
      console.error("useGetAccountList:", res);
    },
  });

  const createZeroDteStrategy = useCreateZeroDteStrategy({
    onSuccess: (res: any) => {
      getAccountList.mutate();
    },
    onError: (res: any) => {
      setMutating(false);
      console.error("useCreateFifoStrategy", res);
    },
  });

  const stopFifoStrategy = useZeroDteStopStrategy({
    onSuccess: (res: any) => {
      getAccountList.mutate();
    },
    onError: (res: any) => {
      setMutating(false);
      console.error("useStopStrategy", res);
    },
  });

  const startFifoStrategy = useZeroDteStartStrategy({
    onSuccess: (res: any) => {
      getAccountList.mutate();
    },
    onError: (res: any) => {
      setMutating(false);
      console.error("useStartStrategy", res);
    },
  });

  const deleteFifoStrategy = useDeleteZeroDteStrategy({
    onSuccess: useCallback(
      (res: any) => {
        getAccountList.mutate();
      },
      [getAccountList],
    ),
    onError: (res: any) => {
      setMutating(false);
      console.error("useDeleteStrategy", res);
    },
  });

  useInterval(
    () => {
      getAccountList.mutate();
    },
    1 * 60 * 1000,
  ); // Refresh once every 5 minutes.

  const upsertTastytradeConnection = useUpsertTastytradeConnection({
    onSuccess: useCallback(
      (res: any) => {
        setStatus("loginSubmitted", true);
        const newActiveStep =
          isLastStep() && !allStepsCompleted()
            ? // It's the last step, but not all steps have been completed,
              // find the first step that has been completed
              steps.findIndex((step, i) => !(i in completed))
            : activeStep + 1;
        setActiveStep(newActiveStep);
        setErrorMessage("");
        getAccountList.mutate();
      },
      [activeStep, allStepsCompleted, completed, getAccountList, isLastStep, setStatus],
    ),
    onError: (res: any) => {
      if (res && res.message) {
        setErrorMessage(`Error connecting to Tastytrade: ${res.message}`);
      } else {
        setErrorMessage("Unknown error connecting to Tastytrade!");
      }
    },
  });

  const handleNext = useCallback(() => {
    if (activeStep === 0) {
      setErrorMessage("");
      if (isLoginValid()) {
        if (loginState.password && loginState.password?.length > 0) {
          upsertTastytradeConnection.mutate(loginState);
          if (positionTableData.length) setConfiguring(false);
        } else {
          setStatus("loginSubmitted", true);
          const newActiveStep =
            isLastStep() && !allStepsCompleted()
              ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
              : activeStep + 1;
          setActiveStep(newActiveStep);
        }
      } else {
        setStatus("loginSubmitted", false);
      }
    } else if (activeStep === 1) {
      if (isAccountNumberValid()) {
        setStatus("accountSelectionSubmitted", true);
        //const logg = strategyAccountConnectState.accountNumber;
        const newActiveStep =
          isLastStep() && !allStepsCompleted()
            ? // It's the last step, but not all steps have been completed,
              // find the first step that has been completed
              steps.findIndex((step, i) => !(i in completed))
            : activeStep + 1;
        setActiveStep(newActiveStep);
        enableNext();
      } else {
        setStatus("accountSelectionSubmitted", false);
      }
    } else if (activeStep === 2) {
      if (isExchangeAccountValid()) {
        setStatus("accountStatus", true);
        //const logg = exchangeAccountState;
        const newActiveStep =
          isLastStep() && !allStepsCompleted()
            ? // It's the last step, but not all steps have been completed,
              // find the first step that has been completed
              steps.findIndex((step, i) => !(i in completed))
            : activeStep + 1;
        setActiveStep(newActiveStep);
      } else {
        setStatus("accountStatus", false);
      }
    } else {
      const newActiveStep =
        isLastStep() && !allStepsCompleted()
          ? // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            steps.findIndex((step, i) => !(i in completed))
          : activeStep + 1;
      setActiveStep(newActiveStep);
    }
  }, [
    activeStep,
    allStepsCompleted,
    completed,
    enableNext,
    isAccountNumberValid,
    isExchangeAccountValid,
    isLastStep,
    isLoginValid,
    loginState,
    positionTableData.length,
    setStatus,
    upsertTastytradeConnection,
  ]);

  const handleBack = () => {
    setConfiguring(false);
  };

  const handleCancel = () => {
    setActiveStep(0);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  useEffect(() => {
    getAccountList.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddStrategy = () => {
    setMutating(true);
    createZeroDteStrategy.mutate({
      active: true,
      exchangeAccountNumber: strategyAccountConnectState.accountNumber,
    });

    setConfiguring(false);
    setPositionTableData([
      ...positionTableData,
      {
        fifoFeed: fifoFeedOption,
        status: "Running",
        tradeSymbol: tradeSymbolOption,
        tradeQty: qty,
        account: strategyAccountConnectState.accountNumber,
        id: uuid(),
      },
    ]);
  };

  const onDeleteStrategy = (row: IPositionTableRow) => {
    setMutating(true);
    deleteFifoStrategy.mutate({
      accountNumber: row.account as string,
      masterSymbol: encodeURIComponent(row.tradeSymbol),
      tradeSymbol: encodeURIComponent(row.tradeSymbol),
    });
  };

  const onStopStrategy = (row: IPositionTableRow) => {
    setMutating(true);
    stopFifoStrategy.mutate({
      accountNumber: row.account as string,
      masterSymbol: encodeURIComponent(row.tradeSymbol),
      tradeSymbol: encodeURIComponent(row.tradeSymbol),
    });
  };

  const onStartStrategy = (row: IPositionTableRow) => {
    setMutating(true);
    startFifoStrategy.mutate({
      accountNumber: row.account as string,
      masterSymbol: encodeURIComponent(row.tradeSymbol),
      tradeSymbol: encodeURIComponent(row.tradeSymbol),
    });
  };
  return (
    <>
      <div className="stepperStyling">
        <div className="stepperHeader">
          <RadioButtonUncheckedIcon
            sx={{
              color:
                isLoginValid() &&
                isAccountNumberValid() &&
                state.loginSubmitted &&
                state.accountSelectionSubmitted &&
                !configuring
                  ? "green"
                  : "red",
            }}
          />
          <span className="connectionStatus">
            Tastytrade{" "}
            {isLoginValid() &&
            isAccountNumberValid() &&
            state.loginSubmitted &&
            state.accountSelectionSubmitted &&
            !configuring
              ? "connected"
              : "disconnected"}{" "}
          </span>
          <IconButton
            disabled={configuring || automationRunning}
            onClick={handleSettingsClicked}
            aria-label="settings">
            <Settings sx={{ color: !configuring && !automationRunning ? "white" : "#5e5e5e" }} />
          </IconButton>
        </div>
        <Box
          sx={{
            padding: "30px",
            border: "2px solid #588fc9",
            background: "#2a3642",
          }}>
          {configuring && activeStep > 0 && (
            <Stepper
              sx={{ fontSize: "18px !important" }}
              nonLinear
              orientation={isDesktop ? "horizontal" : "vertical"}
              activeStep={activeStep - 1}>
              {steps.map((label, index) => (
                <Step
                  sx={{ fontSize: "18px !important" }}
                  key={label}
                  completed={completed[index]}>
                  <StepButton
                    sx={{ fontSize: "18px !important" }}
                    color="inherit"
                    disabled={
                      (index === 0 && (!isLoginValid() || !state.loginSubmitted)) ||
                      (index === 1 &&
                        (!isLoginValid() ||
                          !state.loginSubmitted ||
                          !isAccountNumberValid() ||
                          !state.accountSelectionSubmitted))
                    }
                    onClick={handleStep(index + 1)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          )}
          <div>
            {allStepsCompleted() ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {activeStep === 0 && configuring && (
                  <Login
                    state={loginState}
                    onChange={handleLoginChange}
                    handleStatusUpdate={enableNext}
                  />
                )}
                {activeStep === 1 && configuring && (
                  <Accounts
                    accountNumber={strategyAccountConnectState.accountNumber ?? ""}
                    tableData={tableData}
                    onAccountSelected={handleAccountSelected}
                    handleStatusUpdate={enableNext}
                  />
                )}
                {activeStep === 2 && configuring && (
                  <AccountStatus
                    qty={qty}
                    onTradeSymbolChanged={value => setTradeSymbolOption(value)}
                    tradeSymbolOption={tradeSymbolOption}
                    tradeSymbolOptions={tradeSymbolOptions}
                    membership={membership}
                    state={exchangeAccountState}
                    refreshAccount={getAccountList}
                    handleStatusUpdate={enableNext}
                  />
                )}
                {!configuring && (
                  <ZeroDteComponent
                    onDeleteStrategy={onDeleteStrategy}
                    onStopStrategy={onStopStrategy}
                    onStartStrategy={onStartStrategy}
                    onAddStrategy={() => {
                      setActiveStep(1);
                      setConfiguring(true);
                    }}
                    strategiesRows={positionTableData}
                    strategyAccountConnectState={strategyAccountConnectState}
                    errorMessage={errorMessage}
                    isMutating={mutating}
                  />
                )}
                {configuring && (
                  <Box sx={{ display: "flex", flexDirection: "row", mt: "80px" }}>
                    {((activeStep === 1 && positionTableData.length > 0) || activeStep === 2) && (
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        sx={{ mr: 1, transition: "1" }}>
                        Back
                      </Button>
                    )}
                    {activeStep === 1 && positionTableData.length === 0 && (
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{ mr: 1, transition: "1" }}>
                        Cancel
                      </Button>
                    )}
                    <Box sx={{ flex: "1 1 auto" }} />
                    {errorMessage.length > 0 ? <span className="errorMessage">{errorMessage}</span> : <></>}
                    {activeStep === 2 ? (
                      <Button
                        color="success"
                        variant="outlined"
                        onClick={onAddStrategy}
                        disabled={!enabled || mutating}
                        sx={{ mr: 1 }}>
                        Add Strategy
                      </Button>
                    ) : (
                      <Button
                        color="success"
                        variant="outlined"
                        onClick={handleNext}
                        disabled={!enabled || mutating}
                        sx={{ mr: 1 }}>
                        Next
                      </Button>
                    )}
                  </Box>
                )}
              </React.Fragment>
            )}
          </div>
        </Box>
      </div>
    </>
  );
}
