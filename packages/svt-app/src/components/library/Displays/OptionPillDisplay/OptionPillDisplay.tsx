import React from "react";

import { ThemeProvider, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import "./OptionPillDisplay.scss";

const RenderItem = (text: string, type: string, className: string) => {
  return (
    <div
      className={`dx-theme-material-typography option-pill-${type} ${className}`}
    >
      {text}
    </div>
  );
};

const RenderValuePillLeft = (props: { text: string }) => {
  return RenderItem(props.text, "left", "pill-value");
};
const RenderValuePillMiddle = (props: { text: string }) => {
  return RenderItem(props.text, "middle", "pill-value");
};
const RenderValuePillMiddleDate = (props: { text: string }) => {
  return RenderItem(props.text, "middle-date", "pill-value");
};
const RenderValuePillRight = (props: { text: string }) => {
  return RenderItem(props.text, "right", "pill-value");
};

interface OptionPillDisplayProps {
  callPut?: string;
  credit?: number;
  size?: number;
  dte?: number;
  expirationDate?: Date;
}

const OptionPillDisplay = ({
  callPut = "",
  credit = 0,
  size = 0,
  dte = 0,
  expirationDate = new Date(),
  ...props
}: OptionPillDisplayProps) => {
  const appTheme = useTheme();

  return (
    <ThemeProvider theme={appTheme}>
      <Grid container spacing={0} className={"option-pill-display"}>
        <Grid xs={2}>
          <div className="inner-border-right">
            <RenderValuePillLeft text={(size * -1).toString()} />
          </div>
        </Grid>
        <Grid xs={5}>
          <div className="inner-border-right">
            <RenderValuePillMiddleDate
              text={`${expirationDate.toLocaleDateString("en-us", {
                day: "numeric",
                month: "short",
              })} (${dte}d)`}
            />
          </div>
        </Grid>
        <Grid xs={3}>
          <div className="inner-border-right">
            <RenderValuePillMiddle text={callPut} />
          </div>
        </Grid>
        <Grid xs={2}>
          <RenderValuePillRight text={credit.toFixed(2)} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default OptionPillDisplay;
