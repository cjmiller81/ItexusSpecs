import { lighten, Typography } from "@mui/material";
import { Stack, StackProps, useMediaQuery, useTheme } from "@mui/system";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { ProgressFooter } from "../ProgressBar";
import MinMaxField from "./MinMaxField";

type TileProps = StackProps & {
  labelsPostfix: string | null;
  minSize?: number;
  maxSize?: number;
  progress: number;
  secondsLeft: number;
  onReject: () => void;
};

const FooterSection: React.FC<TileProps> = ({
  minSize,
  maxSize,
  labelsPostfix,
  progress,
  secondsLeft,
  onReject,
  ...props
}) => {
  const theme = useTheme();
  const { t } = useTranslation("FooterSection");
  const renderMinSize = () => {
    return (
      <MinMaxField
        label={renderLabel(`${t("MinSize")}: `, labelsPostfix)}
        value={minSize}
      />
    );
  };

  const renderLabel = (prefix: string, postfix: string | null) => {
    const color= theme.palette.mode === "light" ? lighten("#000", 0.4) : theme.palette.text.primary
    return (
      <>
        <Typography
          color={color}
          variant="caption">
          {prefix}
        </Typography>
        <span
          style={{
            color:color,
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
          >
          {postfix || "--"}
        </span>
      </>
    );
  };
  const renderMaxSize = () => {
    return (
      <MinMaxField
        label={renderLabel(`${t("MaxSize")}: `, labelsPostfix)}
        value={maxSize}
      />
    );
  };

  const renderProgress = () => {
    return (
      progress > 0 && (
        <Stack>
          <ProgressFooter
            alignSelf="center"
            width="300px"
            secondsLeft={secondsLeft}
            progress={progress}
            handleReject={onReject}
          />
        </Stack>
      )
    );
  };

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {isSmall && (
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          width="100%"
          {...props}>
          <Stack
            alignItems="center"
            width="100%">
            <Stack
              width="100%"
              direction="row"
              alignItems={"center"}
              justifyContent="space-between">
              {renderMinSize()}
              {renderMaxSize()}
            </Stack>
            <Stack
              height="40px"
              mt={4}>
              {renderProgress()}
            </Stack>
          </Stack>
        </Stack>
      )}

      {!isSmall && (
        <Stack
          alignItems="center"
          direction="row"
          height="40px"
          justifyContent="space-between"
          width="100%"
          {...props}>
          {renderMinSize()}
          {renderProgress()}
          {renderMaxSize()}
        </Stack>
      )}
    </>
  );
};

export default FooterSection;
