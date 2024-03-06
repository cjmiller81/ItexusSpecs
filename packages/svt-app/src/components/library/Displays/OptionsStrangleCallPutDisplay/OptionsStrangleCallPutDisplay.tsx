import React, { useEffect, useState } from "react";

import { ThemeProvider, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import "./OptionsStrangleCallPutDisplay.scss";

const RenderItem = (text: string, className: string) => {
  return (
    <div className={`dx-theme-material-typography ${className}`}>{text}</div>
  );
};
const RenderCallItem = (text: string, type: string, className: string) => {
  return (
    <div
      className={`custom-typography dx-theme-material-typography selected-call-${type} ${className}`}
    >
      {text}
    </div>
  );
};
const RenderPutItem = (text: string, type: string, className: string) => {
  return (
    <div
      className={`custom-typography dx-theme-material-typography selected-put-${type} ${className}`}
    >
      {text}
    </div>
  );
};

const RenderCenterCol = (props: { text: string }) => {
  return RenderItem(props.text, "strangle-center-col");
};
const RenderMarkPrice = (props: { text: string }) => {
  return RenderItem(props.text, "strangle-title-col");
};

const RenderSelectedCallLeft = (props: { text: string }) => {
  return RenderCallItem(props.text, "left", "strangle-selection-value");
};
const RenderSelectedCallMiddle = (props: { text: string }) => {
  return RenderCallItem(props.text, "middle", "strangle-selection-value");
};
const RenderSelectedCallRight = (props: { text: string }) => {
  return RenderCallItem(
    props.text,
    "right",
    "strangle-center-col strangle-selection-value"
  );
};

const RenderSelectedPutLeft = (props: { text: string }) => {
  return RenderPutItem(
    props.text,
    "left",
    "strangle-center-col strangle-selection-value"
  );
};
const RenderSelectedPutMiddle = (props: { text: string }) => {
  return RenderPutItem(props.text, "middle", "strangle-selection-value");
};
const RenderSelectedPutRight = (props: { text: string }) => {
  return RenderPutItem(props.text, "right", "strangle-selection-value");
};

interface OptionsStrangleCallPutDisplayProps {
  callCredit?: number;
  putCredit?: number;
  size?: number;
  dte?: number;
}

const OptionsStrangleCallPutDisplay = ({
  callCredit = 0,
  putCredit = 0,
  size = 0,
  dte = 0,
  ...props
}: OptionsStrangleCallPutDisplayProps) => {
  const [localCallCredit, setLocalCallCredit] = useState("0.0");
  const [localPutCredit, setLocalPutCredit] = useState("0.0");
  const appTheme = useTheme();

  useEffect(() => {
    setLocalCallCredit(callCredit.toFixed(2));
    setLocalPutCredit(putCredit.toFixed(2));
  }, [callCredit, putCredit]);

  return (
    <ThemeProvider theme={appTheme}>
      <Grid container className={"options-strangle-call-put-display"}>
        <Grid
          container
          xs={12}
          columns={11}
          spacing={0}
          className="options-strangle-header"
        >
          <Grid xs={3}>CALLS</Grid>
          <Grid xs={2}></Grid>
          <Grid xs={1}>{`${dte.toString()} DTE`}</Grid>
          <Grid xs={2}></Grid>
          <Grid xs={3}>PUTS</Grid>
        </Grid>
        <Grid container xs={12} columns={11} spacing={0}>
          <Grid xs={3}></Grid>
          <Grid xs={2}>
            <RenderMarkPrice text="MARK PRICE" />
          </Grid>
          <Grid xs={1} className="strangle-mark-price-center-col"></Grid>
          <Grid xs={2}>
            <RenderMarkPrice text="MARK PRICE" />
          </Grid>
          <Grid xs={3}></Grid>
        </Grid>
        <Grid container xs={12} columns={11} spacing={0}>
          <Grid xs={3}></Grid>
          <Grid xs={2}></Grid>
          <Grid xs={1}>
            <RenderCenterCol text="" />
          </Grid>
          <Grid xs={2}></Grid>
          <Grid xs={3}></Grid>
        </Grid>
        <Grid container xs={12} columns={11} spacing={0}>
          <Grid xs={3}></Grid>
          <Grid xs={2}></Grid>
          <Grid xs={1}>
            <RenderSelectedPutLeft text="- - -" />
          </Grid>
          <Grid xs={2}>
            <RenderSelectedPutMiddle text={`${localPutCredit}~`} />
          </Grid>
          <Grid xs={3}>
            <RenderSelectedPutRight text={`Sell ${size} PUTS`} />
          </Grid>
        </Grid>
        <Grid container xs={12} columns={11} spacing={0}>
          <Grid xs={3}></Grid>
          <Grid xs={2}></Grid>
          <Grid xs={1}>
            <RenderCenterCol text="" />
          </Grid>
          <Grid xs={2}></Grid>
          <Grid xs={3}></Grid>
        </Grid>
        <Grid
          container
          xs={12}
          columns={11}
          spacing={0}
          className="options-strangle-border-dash"
        >
          <Grid xs={3}></Grid>
          <Grid xs={2}></Grid>
          <Grid xs={1}>
            <RenderCenterCol text="" />
          </Grid>
          <Grid xs={2}></Grid>
          <Grid xs={3}></Grid>
        </Grid>
        <Grid container xs={12} columns={11} spacing={0}>
          <Grid xs={3}>
            <RenderSelectedCallLeft text={`Sell ${size} CALLS`} />
          </Grid>
          <Grid xs={2}>
            <RenderSelectedCallMiddle text={`${localCallCredit}~`} />
          </Grid>
          <Grid xs={1}>
            <RenderSelectedCallRight text="- - -" />
          </Grid>
          <Grid xs={2}></Grid>
          <Grid xs={3}></Grid>
        </Grid>
        <Grid container xs={12} columns={11} spacing={0}>
          <Grid xs={3}></Grid>
          <Grid xs={2}></Grid>
          <Grid xs={1}>
            <RenderCenterCol text="" />
          </Grid>
          <Grid xs={2}></Grid>
          <Grid xs={3}></Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default OptionsStrangleCallPutDisplay;
