import * as React from "react";
import { useCallback, useEffect } from "react";

import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Settings } from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import Login from "./login";
import Accounts from "./accounts";
import AccountStatus from "./account-status";
import AutomationComponent from "./automation/Automation";
import { ExchangeAccount, IvlRiskTolerance, SvtIvlEsStrategySetStatus, TastytradeAccountConnect, useGetAccountList, useGetIvlAutomationStatus, useStopIvlAutomation, useUpsertIvlAutomation, useUpsertTastytradeConnection } from "../../../services/tradingPlatformService";

import "./IvlAutomated.scss";
import { useMediaQuery } from "@mui/material";
import { useInterval } from "../../../utils";

const steps = [
  "Tastytrade Login",
  "Select Account",
  "Account Status",
];
interface IState {
  loginSubmitted: boolean;
  accountSelectionSubmitted: boolean;
  accountStatus: boolean;
}

export default function IvlAutomated() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [automationRunning, setAutomationRunning] = React.useState(false);
  const [initConfiguring, setInitConfiguring] = React.useState(true);
  const [configuring, setConfiguring] = React.useState(true);
  const [enabled, setEnabled] = React.useState(false);
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
    password:	"",
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

  const isDesktop = useMediaQuery('(min-width:800px)');

  const totalSteps = () => {
    return steps.length;
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
    setState((prevstatus) => ({
      ...prevstatus,
      [statusName]: state,
    }));
  }, []);

  const isLoginValid = useCallback((): boolean => {
    if (loginState.login.length > 0 && exchangeAccountState !== null && exchangeAccountState.accountNumber && exchangeAccountState.accountNumber.length > 0) {
      return true;
    } else if ((loginState.login.length > 0 && loginState.password !== null && loginState.password?.length > 0)) {
      return true;
    }

    return false;
  }, [exchangeAccountState, loginState.login.length, loginState.password]);

  const isAccountNumberValid = useCallback((): boolean => {
    return strategyAccountConnectState.accountNumber ? (strategyAccountConnectState.accountNumber.length > 0) : false;
  }, [strategyAccountConnectState]);

  const isExchangeAccountValid = useCallback((): boolean => {
    return (membership === "TODO" && !exchangeAccountState.isClosed && exchangeAccountState.isFuturesApproved && exchangeAccountState.isMargin && exchangeAccountState.suitableOptionsLevel === "No Restrictions");
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

  const handleLoginChange = useCallback((newLoginState: TastytradeAccountConnect): void => {
    if (newLoginState.login !== loginState.login) {
      setStatus("loginSubmitted", false);
      setStatus("accountSelectionSubmitted", false);
      setStatus("accountStatus", false);
    }
    setloginState(newLoginState);
  }, [loginState.login, setStatus]);

  const handleAccountSelected = useCallback((newExchangeAccountState: ExchangeAccount): void => {
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
  }, [enableNext, setStatus, strategyAccountConnectState]);

  const handleExchangeAccount = useCallback((newMembership: string, newExchangeAccountState: ExchangeAccount): void => {
    if (newMembership !== membership
      || newExchangeAccountState.isClosed !== exchangeAccountState.isClosed
      || newExchangeAccountState.isFuturesApproved !== exchangeAccountState.isFuturesApproved
      || newExchangeAccountState.isMargin !== exchangeAccountState.isMargin
      || newExchangeAccountState.suitableOptionsLevel !== exchangeAccountState.suitableOptionsLevel
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
  }, [activeStep, enableNext, exchangeAccountState.isClosed, exchangeAccountState.isFuturesApproved, exchangeAccountState.isMargin, exchangeAccountState.suitableOptionsLevel, initConfiguring, isAccountNumberValid, isExchangeAccountValid, isLoginValid, membership, setStatus]);

  const handleSettingsClicked = useCallback(() => {
    setConfiguring(true);
  }, []);

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      if (exchangeAccountState && exchangeAccountState.accountNumber.length > 0) {
        const selectedAccount = tableData.find(row => row.accountNumber === exchangeAccountState.accountNumber);
        if (selectedAccount) {
          handleExchangeAccount(membership, selectedAccount);
        }
      } else if (strategyAccountConnectState && strategyAccountConnectState.accountNumber && strategyAccountConnectState.accountNumber.length > 0) {
        const selectedAccount = tableData.find(row => row.accountNumber === strategyAccountConnectState.accountNumber);
        if (selectedAccount) {
          handleExchangeAccount(membership, selectedAccount);
        }
      }
    }
  }, [tableData, exchangeAccountState, strategyAccountConnectState, handleExchangeAccount, membership]);

  const getIvlAutomationStatus = useGetIvlAutomationStatus({
    onSuccess: useCallback((res: SvtIvlEsStrategySetStatus | unknown) => {
      if (res && (res as SvtIvlEsStrategySetStatus)) {
        const strategySetStatus = (res as SvtIvlEsStrategySetStatus)
        if (strategySetStatus) {
          if (strategySetStatus.exchangeUsername && strategySetStatus.exchangeUsername.length > 0) {
            setloginState({
              ...loginState,
              login: strategySetStatus.exchangeUsername,
            });

            setStatus("loginSubmitted", true);

            setState({
              ...state,
              loginSubmitted: true,
            });
          }
          if (strategySetStatus.accountNumber && strategySetStatus.accountNumber.length > 0) {
            setStrategyAccountConnectState({
              ...strategyAccountConnectState,
              accountNumber: strategySetStatus.accountNumber,
              capitalAllocation: strategySetStatus.capitalAllocation,
              capitalAllocationStart: strategySetStatus.capitalAllocationStart,
              capitalAllocationNext: strategySetStatus.capitalAllocationNext,
              contractQty: strategySetStatus.contractQty,
              entryOrderId: strategySetStatus.entryOrderId,
              entryExchangeOrderId: strategySetStatus.entryExchangeOrderId,
              entryOrderStatus: strategySetStatus.entryOrderStatus,
              entryOrderSymbol: strategySetStatus.entryOrderSymbol,
              exchangeUsername: strategySetStatus.exchangeUsername,
              exitOrderId: strategySetStatus.exitOrderId,
              exitExchangeOrderId: strategySetStatus.exitExchangeOrderId,
              exitOrderStatus: strategySetStatus.exitOrderStatus,
              exitOrderSymbol: strategySetStatus.exitOrderSymbol,
              isStarted: strategySetStatus.isStarted,
              riskTolerance: strategySetStatus.riskTolerance,
              closingOnly: strategySetStatus.closingOnly
            });

            setStatus("accountSelectionSubmitted", true);
            setAutomationRunning(strategySetStatus.isStarted);
            setErrorMessage(strategySetStatus.userMessage ?? "");
          }

          if (strategySetStatus.exchangeUsername && strategySetStatus.exchangeUsername.length > 0 && strategySetStatus.accountNumber && strategySetStatus.accountNumber.length > 0) {
            enableNext();
          }
        }
      }
    }, [enableNext, loginState, setStatus, state, strategyAccountConnectState]),
    onError: useCallback((res: any) => {
      console.error("useGetIvlAutomationStatus:", res);
    }, [])
  });

  const getAccountList = useGetAccountList({
    onSuccess: useCallback((res: ExchangeAccount[] | unknown) => {
      if (res && (res as ExchangeAccount[])) {
        const accountList = (res as ExchangeAccount[])
        if (accountList && accountList.length > 0 && accountList[0].exchangeUsername.length > 0) {
          setloginState({
            ...loginState,
            login: accountList[0].exchangeUsername,
          });

          setTableData(accountList);
        }

        getIvlAutomationStatus.mutate();
      }
    }, [getIvlAutomationStatus, loginState]),
    onError: (res: any) => {
      console.error("useGetAccountList:", res);
    }
  });

  useInterval(() => {
    getAccountList.mutate();
  }, (1 * 60 * 1000)) // Refresh once every 5 minutes.

  const upsertTastytradeConnection = useUpsertTastytradeConnection({
    onSuccess: useCallback((res: any) => {
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
    }, [activeStep, allStepsCompleted, completed, getAccountList, isLastStep, setStatus]),
    onError: (res: any) => {
      if (res && res.message) {
        setErrorMessage(`Error connecting to Tastytrade: ${res.message}`);
      } else {
        setErrorMessage("Unknown error connecting to Tastytrade!");
      }
    }
  });

  const upsertIvlAutomation = useUpsertIvlAutomation({
    onSuccess: useCallback((res: any) => {
      setAutomationRunning((res as boolean));
      setErrorMessage("");
      getAccountList.mutate();
    }, [getAccountList]),
    onError: (res: any) => {
      if (res && res.message) {
        setErrorMessage(`Error starting IVL Automation: ${res.message}`);
      } else {
        setErrorMessage("Unknown error starting IVL Automation!");
      }
    }
  });

  const stopIvlAutomation = useStopIvlAutomation({
    onSuccess: useCallback((res: any) => {
      setAutomationRunning(!(res as boolean));
      setErrorMessage("");
      getAccountList.mutate();
    }, [getAccountList]),
    onError: (res: any) => {
      if (res && res.message) {
        setErrorMessage(`Error stopping IVL Automation: ${res.message}`);
      } else {
        setErrorMessage("Unknown error stopping IVL Automation!");
      }
    }
  });

  const handleCapitalAllocation = useCallback((newCapitalAllocation: number, localOnly: boolean = false): void => {
    if (localOnly) {
      setStrategyAccountConnectState({...strategyAccountConnectState, capitalAllocationNext: { units: newCapitalAllocation, nanos: 0 } });
    } else {
      upsertIvlAutomation.mutate({...strategyAccountConnectState, capitalAllocationNext: { units: newCapitalAllocation, nanos: 0 } });
    }
  }, [strategyAccountConnectState, upsertIvlAutomation]);

  const handleAutomationRunningChange = useCallback((newAutomationRunning: boolean): void => {
    if (newAutomationRunning) {
      upsertIvlAutomation.mutate({...strategyAccountConnectState, closingOnly: false});
    } else {
      stopIvlAutomation.mutate();
    }
  }, [stopIvlAutomation, strategyAccountConnectState, upsertIvlAutomation]);

  const handleClosingOnlyChange = useCallback((newClosingOnly: boolean, localOnly: boolean = false) => {
    if (localOnly) {
      setStrategyAccountConnectState({...strategyAccountConnectState, closingOnly: newClosingOnly});
    } else {
      upsertIvlAutomation.mutate({...strategyAccountConnectState, closingOnly: newClosingOnly});
    }
  }, [strategyAccountConnectState, upsertIvlAutomation]);

  const handleNext = useCallback(() => {
    if (activeStep === 0) {
      setErrorMessage("");
      if (isLoginValid()) {
        if (loginState.password && loginState.password?.length > 0) {
          upsertTastytradeConnection.mutate(loginState);
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
    } else if (activeStep === 2){
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
  }, [activeStep, allStepsCompleted, completed, enableNext, isAccountNumberValid, isExchangeAccountValid, isLastStep, isLoginValid, loginState, setStatus, upsertTastytradeConnection]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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

  return (
    <>
      <div className="stepperStyling">
        <div className="stepperHeader">
          <RadioButtonUncheckedIcon
            sx={{ color: (isLoginValid() && isAccountNumberValid() && isExchangeAccountValid() && state.loginSubmitted && state.accountSelectionSubmitted && !configuring) ? "green" : "red" }}
          />
          <span className="connectionStatus">
            Tastytrade {(isLoginValid() && isAccountNumberValid() && isExchangeAccountValid() && state.loginSubmitted && state.accountSelectionSubmitted && !configuring) ? "connected" : "disconnected"}{" "}
          </span>
          <IconButton
            disabled={configuring || automationRunning}
            onClick={handleSettingsClicked}
            aria-label="settings"
          >
            <Settings sx={{ color: (!configuring && !automationRunning) ? "white" : "#5e5e5e" }} />
          </IconButton>
        </div>
        <Box
          sx={{
            padding: "30px",
            border: "2px solid #588fc9",
            background: "#2a3642",
          }}
        >
          {configuring && (
            <Stepper
              sx={{ fontSize: "18px !important" }}
              nonLinear
              orientation={isDesktop ? "horizontal" : "vertical"}
              activeStep={activeStep}
            >
              {steps.map((label, index) => (
                <Step
                  sx={{ fontSize: "18px !important" }}
                  key={label}
                  completed={completed[index]}
                >
                  <StepButton
                    sx={{ fontSize: "18px !important" }}
                    color="inherit"
                    disabled={
                      (index === 1 && (!isLoginValid() || !state.loginSubmitted))
                      || (index === 2 && (!isLoginValid() || !state.loginSubmitted || !isAccountNumberValid() || !state.accountSelectionSubmitted))
                    }
                    onClick={handleStep(index)}
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          )}
          <div>
            {allStepsCompleted() ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* <h1>{activeStep}</h1> */}
                {activeStep === 0 && configuring && (
                  <Login state={loginState} onChange={handleLoginChange} handleStatusUpdate={enableNext} />
                )}
                {activeStep === 1 && configuring && (
                  <Accounts accountNumber={strategyAccountConnectState.accountNumber ?? ""} tableData={tableData} onAccountSelected={handleAccountSelected} handleStatusUpdate={enableNext} />
                )}
                {activeStep === 2 && configuring && (
                  <AccountStatus membership={membership} state={exchangeAccountState} refreshAccount={getAccountList} handleStatusUpdate={enableNext} />
                )}
                {!configuring
                  && <AutomationComponent
                    strategyAccountConnectState={strategyAccountConnectState}
                    automationRunning={automationRunning}
                    onAutomationRunningChange={handleAutomationRunningChange}
                    onClosingOnlyChange={handleClosingOnlyChange}
                    onCapitalAllocationChange={handleCapitalAllocation}
                    errorMessage={errorMessage}
                  />
                }

                {configuring && (
                  <Box
                    sx={{ display: "flex", flexDirection: "row", mt: "80px" }}
                  >
                    {activeStep !== 0 && (
                      <Button
                        variant="outlined"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1, transition: "1" }}
                      >
                        Back
                      </Button>
                    )}
                    <Box sx={{ flex: "1 1 auto" }} />
                    {errorMessage.length > 0 ? (
                        <span className="errorMessage">
                          {errorMessage}
                        </span>
                      ) : (
                        <></>
                      )
                    }
                    {activeStep === 2 ? (
                      <Button
                        color="success"
                        variant="outlined"
                        onClick={() => setConfiguring(false)}
                        disabled={!enabled}
                        sx={{ mr: 1 }}
                      >
                        Connect Tastytrade
                      </Button>
                    ) : (
                      <Button
                        color="success"
                        variant="outlined"
                        onClick={handleNext}
                        disabled={!enabled}
                        sx={{ mr: 1 }}
                      >
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
