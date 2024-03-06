import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Divider,
  FormControl,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";
import NumberBox from "devextreme-react/number-box";
import TradeingRangeDisplay from "../../TradingRangeDisplay";
import LabeledBoxedValueDisplay from "../../LabeledBoxedValueDisplay";
import SelectBox from "devextreme-react/select-box";
import { NativeEventInfo } from "devextreme/events";
import { SelectBoxInstance } from "devextreme/ui/select_box";
import { ValueChangedInfo } from "devextreme/ui/editor/editor";

function RiskToleranceMsg(props: {
  riskTol: string;
}) {
  switch (props.riskTol) {
    case "HIGH":
      return <>
        You've selected that you have a <b>HIGH</b> Risk Tolerance. This means you should be comfortable with large drawdowns in the case of a large market move. If this is not the case, then please select a different Risk Tolerance above.
      </>
    case "MEDIUM":
      return <>
        You've selected that you have a <b>MEDIUM</b> Risk Tolerance. This means you should be comfortable with sizable account balance fluctuations, especially in the case of a large market move. If this is not the case, then please lower your Risk Tolerance.
        </>
    case "LOW":
      return <>
        You've selected that you have a <b>LOW</b> Risk Tolerance. This means capital preservation is a priority for you and you're okay with sacrificing some returns to achieve that.
        </>
    default:
      return <></>;
  }
}

export default function TradeGenerator() {
  const [dteValue, setDteValue] = useState<number>(45);
  const [freeCap, setFreeCap] = useState<number>(90000);
  const [riskTolerance, setRiskTolerance] = useState<string>("HIGH");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const selectBoxInputAttr = {
    id: 'risk-tolerance-select-box-input',
    style: 'background-color: rgb(21 28 50)'
  };

  const riskToleranceOptions = [
    'HIGH',
    'MEDIUM',
    'LOW',
  ];

  const riskToleranceSettings = useMemo(() => {
    return {
      "HIGH": {
        extrinsicAnnualized: 0.2,
        targetCapitalPerContract: 13_000.00,
        collectPutCreditPercent: 0.75,
      },
      "MEDIUM": {
        extrinsicAnnualized: 0.12,
        targetCapitalPerContract: 17_333.00,
        collectPutCreditPercent: 0.75,
      },
      "LOW": {
        extrinsicAnnualized: 0.07,
        targetCapitalPerContract: 24_000.00,
        collectPutCreditPercent: 0.75,
      },
    };
  }, []);

  const symbolMultiplierMap = useMemo(() => { return { "/ES": 50.0 }}, []);

  useEffect((): void => {
    if (isLoaded) {
      localStorage.setItem("tradeGenerator", JSON.stringify({
        dteValue,
        freeCap,
        riskTolerance,
      }));
    }
  }, [isLoaded, dteValue, freeCap, riskTolerance]);

  const onRiskToleranceChanged = (e: NativeEventInfo<SelectBoxInstance, Event | KeyboardEvent | MouseEvent | PointerEvent> & ValueChangedInfo): void => {
    setRiskTolerance(e.value);
  };

  const getExtrinsicAnnualized = useCallback((riskTol: string) => {
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
  }, [riskToleranceSettings]);

  const getExtrinsicAnnualizedPercent = useCallback((riskTol: string) => {
    return Math.round(getExtrinsicAnnualized(riskTol) * 100);
  }, [getExtrinsicAnnualized]);

  const getTargetCapitalPerContract = useCallback((riskTol: string) => {
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
  }, [riskToleranceSettings]);

  const getCollectPutCreditPercent = useCallback((riskTol: string) => {
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
  }, [riskToleranceSettings]);

  const getTargetCapitalAccountPercent = useCallback((riskTol: string) => {
    return (freeCap / getTargetCapitalPerContract(riskTol));
  }, [freeCap, getTargetCapitalPerContract]);

  const getNumberOfContracts = useCallback((riskTol: string) => {
    let targetCapitalAccountPercent = getTargetCapitalAccountPercent(riskTol);

    return targetCapitalAccountPercent < 1 ? 1 : Math.floor(targetCapitalAccountPercent);
  }, [getTargetCapitalAccountPercent]);

  const roundToNearestFiveCents = (num: number) => {
    return Math.round(num / 0.05) * 0.05;
  };

  const roundToNearestQuarter = (num: number) => {
    return Math.round(num / 0.25) * 0.25;
  };

  const getStrangleCredit = useCallback(() => {
    let strangleCredit = ((((freeCap * getExtrinsicAnnualized(riskTolerance)) / 365) * dteValue) / symbolMultiplierMap["/ES"]) / getNumberOfContracts(riskTolerance);

    return strangleCredit < 5 ? roundToNearestFiveCents(strangleCredit) : roundToNearestQuarter(strangleCredit);
  }, [dteValue, freeCap, riskTolerance, getExtrinsicAnnualized, getNumberOfContracts, symbolMultiplierMap]);

  const getPutCredit = useCallback(() => {
    let putCredit = getCollectPutCreditPercent(riskTolerance) * getStrangleCredit();
    return putCredit < 5 ? roundToNearestFiveCents(putCredit) : roundToNearestQuarter(putCredit);
  }, [riskTolerance, getCollectPutCreditPercent, getStrangleCredit]);

  const getCallCredit = () => {
    return getStrangleCredit() - getPutCredit();
  };

  function init() {
    const data = localStorage.getItem("tradeGenerator");
    if (data != null) {
      const formattedData = JSON.parse(data);
      if (formattedData && formattedData.dteValue) {
        setDteValue(formattedData.dteValue);
      }
      if (formattedData && formattedData.freeCap) {
        setFreeCap(formattedData.freeCap);
      }
      if (formattedData && formattedData.riskTolerance) {
        setRiskTolerance(formattedData.riskTolerance);
      }
    }

    setIsLoaded(true);
  }

  useEffect(() => {
    init();

    // returned function will be called on component unmount
    return () => {
    }
  }, [])

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      sx={{
        px: 8,
        py: 5,
        backgroundColor: "#151C32",
      }}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={5}
        sx={{
          maxWidth: "720px",
        }}>
        <Stack
          className="dx-viewport"
          style={{ width: '100%' }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={5}
          sx={{
            border: 2,
            borderColor: 'primary.dark',
            px: 2,
            py: 2,
          }}>
          <FormControl>
            <FormLabel
              sx={{
                color: "#555689",
              }}>
            {("Free Capital").toUpperCase()}
            </FormLabel>
            <NumberBox
              format="$ #,##0.##"
              min={1}
              max={10000000}
              onValueChanged={(e) => {
                setFreeCap(e.value);
              }}
              showSpinButtons={true}
              showClearButton={true}
              step={1}
              stylingMode="outlined"
              value={freeCap}
            />
          </FormControl>
          <FormControl>
            <FormLabel
              sx={{
                color: "#555689",
              }}>
            {("Risk Tolerance").toUpperCase()}
            </FormLabel>
            <SelectBox
              items={riskToleranceOptions}
              onValueChanged={onRiskToleranceChanged}
              stylingMode="outlined"
              value={riskTolerance}
              inputAttr={selectBoxInputAttr}
            />
          </FormControl>
          <FormControl>
            <FormLabel
              sx={{
                color: "#555689",
              }}>
            {("Days to Exp.").toUpperCase()}
            </FormLabel>
            <NumberBox
              min={0}
              max={366}
              onValueChanged={(e) => {
                setDteValue(e.value);
              }}
              showSpinButtons={true}
              showClearButton={true}
              step={1}
              stylingMode="outlined"
              value={dteValue}
            />
          </FormControl>
        </Stack>
        {
          (freeCap < 10000)
          ?
          <>
            <Typography
              color="#A4AED1"
              variant="body1"
              display="block"
              fontSize="body1.fontSize"
              fontWeight="bold"
              textAlign="center"
              gutterBottom>
              The minimum required account size to trade this strategy is:<br />$10,000.
            </Typography>
          </>
          :
          <>
            <Stack
              style={{ width: '100%' }}
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={5}>
              <Typography
                variant="button"
                display="block"
                fontWeight="bold"
                fontSize="h5.fontSize"
                textAlign="left"
                gutterBottom>
                Risk Tolerance
              </Typography>
              <Typography
                color="#A4AED1"
                variant="body1"
                display="block"
                fontSize="body1.fontSize"
                textAlign="left"
                gutterBottom>
                <RiskToleranceMsg riskTol={riskTolerance} />
              </Typography>
            </Stack>

            <Stack
              style={{ width: '100%' }}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={5}
              sx={{
                px: 2,
                py: 2,
              }}>
              <LabeledBoxedValueDisplay label="Low Risk" value={getNumberOfContracts("LOW")} active={riskTolerance === riskToleranceOptions[2]} />
              <LabeledBoxedValueDisplay label="Med Risk" value={getNumberOfContracts("MEDIUM")} active={riskTolerance === riskToleranceOptions[1]} />
              <LabeledBoxedValueDisplay label="High Risk" value={getNumberOfContracts("HIGH")} active={riskTolerance === riskToleranceOptions[0]} />
            </Stack>

            <Stack
              style={{ width: '100%' }}
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              spacing={5}>
              <Typography
                variant="body1"
                display="block"
                fontSize="body1.fontSize"
                fontWeight="bold"
                gutterBottom>
                { `According to the Risk Tolerance you selected, you can trade up to ${getNumberOfContracts(riskTolerance)} Strangles.` }
              </Typography>
            </Stack>

            <Divider style={{ width: '100%' }} />

            <Stack
              style={{ width: '100%' }}
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={5}>
              <Typography
                variant="button"
                display="block"
                fontWeight="bold"
                fontSize="h5.fontSize"
                textAlign="left"
                gutterBottom>
                { `Extrinsic Annualized Target: ${getExtrinsicAnnualizedPercent(riskTolerance)}%` }
              </Typography>
              <Typography
                color="#A4AED1"
                variant="body1"
                display="block"
                fontSize="body1.fontSize"
                textAlign="left"
                gutterBottom>
                { `Trading ` } <b>{ getNumberOfContracts(riskTolerance) }</b> { ` Strangles, with ` } <b>{ dteValue }</b> { ` days to expiration, you'll want to collect around this much permium per strangle to hit your Extrinsic Annual Target of ${getExtrinsicAnnualizedPercent(riskTolerance)}%.` }
              </Typography>
            </Stack>

            <TradeingRangeDisplay
              low={getPutCredit()}
              mid={getStrangleCredit()}
              high={getCallCredit()}
              lowLabel={'Put'}
              midLabel={'Strangle'}
              highLabel={'Call'}
            />
          </>
        }
      </Stack>
    </Stack>
  )
}
