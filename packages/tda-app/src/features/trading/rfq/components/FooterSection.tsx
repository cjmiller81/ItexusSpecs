import { Stack, StackProps, useMediaQuery, useTheme } from "@mui/system";
import * as React from "react";
import ContrastDecimalField from "./ContrastDecimalField";
import { ProgressFooter } from "./ProgressBar";

type TileProps = StackProps & {
  minSize: number;
  maxSize: number;
  progress: number;
  secondsLeft: number;
  onReject: () => void;
};

const FooterSection: React.FC<TileProps> = ({ minSize, maxSize, progress, secondsLeft, onReject, ...props }) => {
  const theme = useTheme();
  const renderMinSize = () => {
    return (
      <ContrastDecimalField
        label="Min Size"
        size="small"
        disabled
        value={minSize}
        maxDecimals={2}
        sx={{ input: { padding: "4px" }, width: "115px" }}
      />
    );
  };

  const renderMaxSize = () => {
    return (
      <ContrastDecimalField
        label="Max Size"
        size="small"
        maxDecimals={2}
        disabled
        value={maxSize}
        sx={{ input: { padding: "4px" }, width: "115px" }}
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
            <Stack height="40px" mt={4}>{renderProgress()}</Stack>
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
