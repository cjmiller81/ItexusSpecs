import React, { useCallback, useState } from "react";
import ButtonGroup from "devextreme-react/button-group";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import "./RiskToleranceSelector.scss";

const RenderRiskMsg = (props: { data: string }) => {
  switch (props.data) {
    case "HIGH":
      return (
        <div className="dx-theme-material-typography dx-font-s risk-tolerance-msg">
          You've selected that you have a <b>{props.data}</b> Risk Tolerance.
          This means you should be comfortable with large drawdowns in the case
          of a large market move. If this is not the case, then please select a
          different Risk Tolerance above.
        </div>
      );
    case "MEDIUM":
      return (
        <div className="dx-theme-material-typography dx-font-s risk-tolerance-msg">
          You've selected that you have a <b>{props.data}</b> Risk Tolerance.
          This means you should be comfortable with sizable account balance
          fluctuations, especially in the case of a large market move. If this
          is not the case, then please lower your Risk Tolerance.
        </div>
      );
    case "LOW":
      return (
        <div className="dx-theme-material-typography dx-font-s risk-tolerance-msg">
          You've selected that you have a <b>{props.data}</b> Risk Tolerance.
          This means capital preservation is a priority for you and you're okay
          with sacrificing some returns to achieve that.
        </div>
      );
    default:
      return <></>;
  }
};

export const riskTolerances = [
  {
    hint: "low",
    level: "low",
    text: "low",
  },
  {
    hint: "Medium",
    level: "medium",
    text: "Medium",
  },
  {
    hint: "High",
    level: "high",
    text: "High",
  },
];
interface RiskToleranceSelectorProps {
  riskTolerance?: string;
  onChange?: (value: string) => void;
}

const RiskToleranceSelector = ({
  riskTolerance = "medium",
  onChange,
  ...props
}: RiskToleranceSelectorProps) => {
  const [localRiskTolerance, setLocalRiskTolerance] = useState(riskTolerance);

  const handleSelectedItemKeysChange = useCallback(
    (value: any[]): void => {
      setLocalRiskTolerance(value[0]);
      if (onChange) {
        onChange(value[0]);
      }
    },
    [onChange]
  );

  return (
    <div className={"risk-tolerance-selector"}>
      <Grid container rowSpacing={3}>
        <Grid xs={12}>
          <div className="risk-tolerance-heading">RISK TOLERANCE</div>
          <ButtonGroup
            items={riskTolerances}
            keyExpr="level"
            stylingMode="outlined"
            selectedItemKeys={[localRiskTolerance]}
            onSelectedItemKeysChange={handleSelectedItemKeysChange}
            className="risk-tolerance-button-group"
          />
        </Grid>
        <Grid xs={12}>
          <RenderRiskMsg data={localRiskTolerance.toUpperCase()} />
        </Grid>
      </Grid>
    </div>
  );
};

export default RiskToleranceSelector;
