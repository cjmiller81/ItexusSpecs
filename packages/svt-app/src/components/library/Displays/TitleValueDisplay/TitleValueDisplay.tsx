import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";

import { formatDollars } from "../../../../utils";

import "./TitleValueDisplay.scss";

interface TitleValueDisplayProps {
  align?: string;
  title?: string;
  titleSize?: string;
  titleColor?: string;
  value?: string;
  valueSize?: string;
  valueColor?: string;
  valueFormat?: string;
  width?: number;
}

const RenderItem = (text: string, type: string, className: string) => {
  return (
    <div
      className={`dx-theme-material-typography title-value-display-${type} ${className}`}
    >
      {text}
    </div>
  );
};

const RenderTitleItem = (props: TitleValueDisplayProps) => {
  const align =
    props.align?.length && props.align?.length > 0
      ? `title-value-display-text-align-${props.align}`
      : "";
  const color =
    props.titleColor?.length && props.titleColor?.length > 0
      ? `title-value-display-color-${props.valueColor}`
      : "";

  return RenderItem(
    props.title as string,
    "title",
    `dx-font-${props.titleSize} ${color} ${align}`
  );
};

const RenderValueItem = (props: TitleValueDisplayProps) => {
  const align =
    props.align?.length && props.align?.length > 0
      ? `title-value-display-text-align-${props.align}`
      : "";
  const color =
    props.valueColor?.length && props.valueColor?.length > 0
      ? `title-value-display-color-${props.valueColor}`
      : "";

  return RenderItem(
    props.value as string,
    "value",
    `dx-font-${props.valueSize} ${color} ${align}`
  );
};

const TitleValueDisplay = ({
  align = "",
  title = "TITLE",
  titleSize = "s",
  titleColor = "",
  value = "VALUE",
  valueSize = "xl",
  valueColor = "",
  valueFormat = "",
  width = 100,
  ...props
}: TitleValueDisplayProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (valueFormat === "currency") {
      setLocalValue(formatDollars(value));
    } else {
      setLocalValue(value);
    }
  }, [valueFormat, value]);

  return (
    <div className={"title-value-display"}>
      <Grid container>
        <Grid xs={12}>
          <RenderTitleItem
            align={align}
            title={title}
            titleSize={titleSize}
            titleColor={titleColor}
          />
        </Grid>
        <Grid xs={12}>
          <RenderValueItem
            align={align}
            value={localValue}
            valueSize={valueSize}
            valueColor={valueColor}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default TitleValueDisplay;
