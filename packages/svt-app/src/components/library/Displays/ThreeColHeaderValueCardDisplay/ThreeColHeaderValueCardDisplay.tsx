import React from "react";
import Grid from "@mui/material/Unstable_Grid2";

import "./ThreeColHeaderValueCardDisplay.scss";

const RenderItem = (text: string, type: string, className: string) => {
  return (
    <div
      className={`dx-theme-material-typography three-col-${type} ${className}`}
    >
      {text}
    </div>
  );
};

const RenderHeaderItemCentered = (props: { data: { text: string } }) => {
  return RenderItem(props.data.text, "header", "center-align-col dx-font-s");
};

const RenderValueItemPadLeft = (props: { data: { text: string } }) => {
  return RenderItem(props.data.text, "value", "pad-left-col label-font");
};
const RenderValueItemCentered = (props: { data: { text: string } }) => {
  return RenderItem(props.data.text, "value", "center-align-col label-font");
};

interface ThreeColHeaderValueCardDisplayProps {
  strangleCredit?: number;
  size?: number;
}

const ThreeColHeaderValueCardDisplay = ({
  strangleCredit = 0,
  size = 0,
  ...props
}: ThreeColHeaderValueCardDisplayProps) => {
  return (
    <div className={"three-col-header-value-card-display"}>
      <Grid container className="mb-2">
        <Grid xs={6}></Grid>
        <Grid xs={3}>
          <RenderHeaderItemCentered data={{ text: "SIZE" }} />
        </Grid>
        <Grid xs={3}>
          <RenderHeaderItemCentered data={{ text: "MARK" }} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid xs={6}>
          <RenderValueItemPadLeft data={{ text: "Sell Strangle" }} />
        </Grid>
        <Grid xs={3}>
          <RenderValueItemCentered data={{ text: (size * -1).toFixed(2) }} />
        </Grid>
        <Grid xs={3}>
          <RenderValueItemCentered data={{ text: strangleCredit.toFixed(2) }} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ThreeColHeaderValueCardDisplay;
