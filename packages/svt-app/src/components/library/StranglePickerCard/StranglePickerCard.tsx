import React, { useCallback, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";

import OptionsSeriesCarrosselPicker from "../InputFields/OptionsSeriesCarrosselPicker/OptionsSeriesCarrosselPicker";
import SymbolLastPriceChangeDisplay from "../Displays/SymbolLastPriceChangeDisplay/SymbolLastPriceChangeDisplay";
import OptionsStrangleCallPutDisplay from "../Displays/OptionsStrangleCallPutDisplay/OptionsStrangleCallPutDisplay";

import "./StranglePickerCard.scss";

interface StranglePickerCardProps {
  callCredit?: number;
  putCredit?: number;
  size?: number;
  dte?: number;
  onChange?: (dte: number, expirationDate: string) => void;
}

const StranglePickerCard = ({
  callCredit = 0,
  putCredit = 0,
  size = 0,
  dte = 0,
  onChange,
  ...props
}: StranglePickerCardProps) => {
  const [localDte, setLocalDte] = useState(dte);

  const handleOptionChanged = useCallback(
    (dte: number, expirationDate: string) => {
      setLocalDte(dte);
      if (onChange) {
        onChange(dte, expirationDate);
      }
    },
    [onChange]
  );

  return (
    <div className={"strangle-picker-card"}>
      <div className={"responsive-padding-custom"}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <div className="top-card-row item">
              <SymbolLastPriceChangeDisplay />
            </div>
          </Grid>
          <Grid xs={12}>
            <div className="middle-card-row item">
              <OptionsSeriesCarrosselPicker
                dte={localDte}
                onChange={handleOptionChanged}
              />
            </div>
          </Grid>
          <Grid xs={12}>
            <div className="bottom-card-row item">
              <OptionsStrangleCallPutDisplay
                callCredit={callCredit}
                putCredit={putCredit}
                size={size}
                dte={localDte}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default StranglePickerCard;
