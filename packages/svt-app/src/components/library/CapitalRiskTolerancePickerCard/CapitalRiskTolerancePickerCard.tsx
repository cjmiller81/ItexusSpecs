import React, { useCallback, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";

import NumberField from "../InputFields/NumberField/NumberField";
import RiskToleranceSelector from "../InputFields/RiskToleranceSelector/RiskToleranceSelector";

import "./CapitalRiskTolerancePickerCard.scss";

interface CapitalRiskTolerancePickerCardProps {
  freeCapital?: number;
  riskTolerance?: string;
  onChange?: (freeCapital: number, riskTolerance: string) => void;
}

const CapitalRiskTolerancePickerCard = ({
  freeCapital = 90000,
  riskTolerance = "medium",
  onChange,
  ...props
}: CapitalRiskTolerancePickerCardProps) => {
  const [locaFreeCapital, setLocalFreeCapital] = useState(freeCapital);
  const [localRiskTolerance, setLocalRiskTolerance] = useState(riskTolerance);

  const handleFreeCapitalChange = useCallback(
    (value: number): void => {
      setLocalFreeCapital(value);
      if (onChange) {
        onChange(value, localRiskTolerance);
      }
    },
    [localRiskTolerance, onChange]
  );

  const handleRiskToleranceChange = useCallback(
    (value: string): void => {
      setLocalRiskTolerance(value);
      if (onChange) {
        onChange(locaFreeCapital, value);
      }
    },
    [locaFreeCapital, onChange]
  );

  return (
    <div className={"capital-risk-tolerance-picker-card"}>
      <div className={"responsive-padding-custom"}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <NumberField
              value={locaFreeCapital}
              onChange={handleFreeCapitalChange}
            />
          </Grid>
          <Grid xs={12}>
            <RiskToleranceSelector
              riskTolerance={localRiskTolerance}
              onChange={handleRiskToleranceChange}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default CapitalRiskTolerancePickerCard;
