import React, { useCallback, useEffect, useMemo, useState } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import { ThemeProvider, useTheme } from "@mui/material";

import StrangleDetailsCard from "../StrangleDetailsCard/StrangleDetailsCard";
import StranglePickerCard from "../StranglePickerCard/StranglePickerCard";
import CapitalRiskTolerancePickerCard from "../CapitalRiskTolerancePickerCard/CapitalRiskTolerancePickerCard";

import "./TradeGenerator.scss";

export default function TradeGenerator() {
  const [extAnnualized, setExtAnnualized] = useState(20.3);
  const [maxProfit, setMaxProfit] = useState(4500.87);
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [localDte, setLocalDte] = useState(45);
  const [freeCap, setFreeCap] = useState<number>(90000);
  const [riskTolerance, setRiskTolerance] = useState<string>("HIGH");
  const [size, setSize] = useState(-6);
  const [localCallCredit, setCallCredit] = useState(-3.45);
  const [localPutCredit, setPutCredit] = useState(-2.13);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const appTheme = useTheme();

  const riskToleranceSettings = useMemo(() => {
    return {
      HIGH: {
        extrinsicAnnualized: 0.2,
        targetCapitalPerContract: 13_000.0,
        collectPutCreditPercent: 0.75,
      },
      MEDIUM: {
        extrinsicAnnualized: 0.12,
        targetCapitalPerContract: 17_333.0,
        collectPutCreditPercent: 0.75,
      },
      LOW: {
        extrinsicAnnualized: 0.07,
        targetCapitalPerContract: 24_000.0,
        collectPutCreditPercent: 0.75,
      },
    };
  }, []);

  const symbolMultiplierMap = useMemo(() => {
    return { "/ES": 50.0 };
  }, []);

  const getExtrinsicAnnualized = useCallback(
    (riskTol: string) => {
      switch (riskTol) {
        case "HIGH":
          return riskToleranceSettings["HIGH"].extrinsicAnnualized;
        case "MEDIUM":
          return riskToleranceSettings["MEDIUM"].extrinsicAnnualized;
        case "LOW":
          return riskToleranceSettings["LOW"].extrinsicAnnualized;
        default:
          return 1;
      }
    },
    [riskToleranceSettings]
  );

  const getExtrinsicAnnualizedPercent = useCallback(
    (riskTol: string) => {
      return Math.round(getExtrinsicAnnualized(riskTol) * 100);
    },
    [getExtrinsicAnnualized]
  );

  const getTargetCapitalPerContract = useCallback(
    (riskTol: string) => {
      switch (riskTol) {
        case "HIGH":
          return riskToleranceSettings["HIGH"].targetCapitalPerContract;
        case "MEDIUM":
          return riskToleranceSettings["MEDIUM"].targetCapitalPerContract;
        case "LOW":
          return riskToleranceSettings["LOW"].targetCapitalPerContract;
        default:
          return 1;
      }
    },
    [riskToleranceSettings]
  );

  const getCollectPutCreditPercent = useCallback(
    (riskTol: string) => {
      switch (riskTol) {
        case "HIGH":
          return riskToleranceSettings["HIGH"].collectPutCreditPercent;
        case "MEDIUM":
          return riskToleranceSettings["MEDIUM"].collectPutCreditPercent;
        case "LOW":
          return riskToleranceSettings["LOW"].collectPutCreditPercent;
        default:
          return 1;
      }
    },
    [riskToleranceSettings]
  );

  const getTargetCapitalAccountPercent = useCallback(
    (riskTol: string) => {
      return freeCap / getTargetCapitalPerContract(riskTol);
    },
    [freeCap, getTargetCapitalPerContract]
  );

  const getNumberOfContracts = useCallback(
    (riskTol: string) => {
      let targetCapitalAccountPercent = getTargetCapitalAccountPercent(riskTol);

      return targetCapitalAccountPercent < 1
        ? 1
        : Math.floor(targetCapitalAccountPercent);
    },
    [getTargetCapitalAccountPercent]
  );

  const roundToNearestFiveCents = (num: number) => {
    return Math.round(num / 0.05) * 0.05;
  };

  const roundToNearestQuarter = (num: number) => {
    return Math.round(num / 0.25) * 0.25;
  };

  const getStrangleCredit = useCallback(() => {
    let strangleCredit =
      (((freeCap * getExtrinsicAnnualized(riskTolerance)) / 365) * localDte) /
      symbolMultiplierMap["/ES"] /
      getNumberOfContracts(riskTolerance);

    return strangleCredit < 5
      ? roundToNearestFiveCents(strangleCredit)
      : roundToNearestQuarter(strangleCredit);
  }, [
    localDte,
    freeCap,
    riskTolerance,
    getExtrinsicAnnualized,
    getNumberOfContracts,
    symbolMultiplierMap,
  ]);

  const getPutCredit = useCallback(() => {
    let putCredit =
      getCollectPutCreditPercent(riskTolerance) * getStrangleCredit();
    return putCredit < 5
      ? roundToNearestFiveCents(putCredit)
      : roundToNearestQuarter(putCredit);
  }, [riskTolerance, getCollectPutCreditPercent, getStrangleCredit]);

  const getCallCredit = useCallback(() => {
    return getStrangleCredit() - getPutCredit();
  }, [getPutCredit, getStrangleCredit]);

  const onCapitalRiskToleranceChange = useCallback(
    (freeCapital: number, riskTolerance: string): void => {
      console.log("onCapitalRiskToleranceChange:", freeCapital, riskTolerance);
      setRiskTolerance(riskTolerance.toUpperCase());
      setFreeCap(freeCapital);
    },
    []
  );

  const onStranglePickerCardChange = useCallback(
    (dte: number, expirationDate: string): void => {
      console.log("onStranglePickerCardChange:", dte);
      setLocalDte(dte);
      setExpirationDate(new Date(expirationDate));
    },
    []
  );

  useEffect((): void => {
    if (isLoaded) {
      localStorage.setItem(
        "tradeGenerator",
        JSON.stringify({
          localDte,
          freeCap,
          riskTolerance: riskTolerance.toUpperCase(),
        })
      );

      const callCredit = getCallCredit();
      const putCredit = getPutCredit();

      setCallCredit(parseFloat(callCredit.toFixed(2)));
      setPutCredit(parseFloat(putCredit.toFixed(2)));
      setSize(getNumberOfContracts(riskTolerance));
      setMaxProfit(
        parseFloat(
          (
            (callCredit + putCredit) *
            size *
            symbolMultiplierMap["/ES"]
          ).toFixed(2)
        )
      );
      setExtAnnualized(getExtrinsicAnnualizedPercent(riskTolerance));

      console.log(
        `recalc riskTolerance: ${riskTolerance} localDte: ${localDte} freeCap: ${freeCap} size: ${size}`
      );
    }
  }, [
    isLoaded,
    localDte,
    freeCap,
    riskTolerance,
    getCallCredit,
    getPutCredit,
    getNumberOfContracts,
    getTargetCapitalPerContract,
    getExtrinsicAnnualizedPercent,
    size,
    symbolMultiplierMap,
  ]);

  useEffect(() => {
    const data = localStorage.getItem("tradeGenerator");
    if (data != null) {
      const formattedData = JSON.parse(data);
      if (formattedData && formattedData.dteValue) {
        setLocalDte(formattedData.dteValue);
      }
      if (formattedData && formattedData.freeCap) {
        setFreeCap(formattedData.freeCap);
      }
      if (formattedData && formattedData.riskTolerance) {
        setRiskTolerance(formattedData.riskTolerance);
      }
    }

    setIsLoaded(true);

    // returned function will be called on component unmount
    return () => {};
  }, []);

  return (
    <React.Fragment>
      <ThemeProvider theme={appTheme}>
        <div className={"content-block"}>
          <div className={"dx-card"}>
            <Grid container spacing={1}>
              <Grid xs={12} lg={4}>
                <div className="left-card">
                  <CapitalRiskTolerancePickerCard
                    onChange={onCapitalRiskToleranceChange}
                  />
                </div>
              </Grid>
              <Grid xs={12} lg={4}>
                <div className="middle-card">
                  <StranglePickerCard
                    callCredit={localCallCredit}
                    putCredit={localPutCredit}
                    size={size}
                    dte={localDte}
                    onChange={onStranglePickerCardChange}
                  />
                </div>
              </Grid>
              <Grid xs={12} lg={4}>
                <div className="right-card">
                  <StrangleDetailsCard
                    extAnnualized={extAnnualized}
                    maxProfit={maxProfit}
                    callCredit={localCallCredit}
                    putCredit={localPutCredit}
                    strangleCredit={parseFloat(
                      (localCallCredit + localPutCredit).toFixed(2)
                    )}
                    size={size}
                    dte={localDte}
                    expirationDate={expirationDate}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </ThemeProvider>
    </React.Fragment>
  );
};
