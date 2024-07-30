import { Typography } from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import { Box, BoxProps, Stack, lighten, useTheme } from "@mui/system";
import { FC } from "react";

export type BuySellCellProps = BoxProps & {
  cellType: "buy" | "sell";
  title: string;
  value?: number | null;
  isExpired: boolean;
  isRequesting: boolean;
  onCellClick: () => void;
  contentAlignment?: "center" | "start" | "end";
};

export const BuySellCell: FC<BuySellCellProps> = ({
  title,
  value,
  isExpired,
  isRequesting,
  cellType,
  onCellClick,
  contentAlignment,
  sx,
  ...props
}) => {
  const theme = useTheme();
  let bgColor: string = theme.palette.mode === "dark" ? grey[800] : grey[200];

  if (value && cellType === "sell") {
    bgColor = theme.palette.mode === "dark" ? red[700] : red[400];
  }

  if (value && cellType === "buy") {
    bgColor = theme.palette.mode === "dark" ? blue[700] : blue[400];
  }
  return (
    <Box
      borderRadius={2}
      p={1}
      px={2}
      sx={{
        minWidth: "190px",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        backgroundColor: bgColor,
        "&:hover": {
          transition: "0.3s",
          backgroundColor: lighten(bgColor, 0.2),
        },
        ...sx,
      }}
      {...props}
      onClick={onCellClick}>
      <Stack
        height={"100%"}
        direction="column"
        justifyContent="space-around"
        alignItems={contentAlignment ?? "start"}>
        <Typography
          sx={{
            color: "white",
            fontSize: 22,
            lineHeight: 1,
            fontWeight: 800,
            WebkitTextStroke: theme.palette.mode === "dark" ? "1px black" : "1px black",
          }}>
          {title}
        </Typography>

        {renderInlargedNum(value)}
      </Stack>
    </Box>
  );
};

const renderInlargedNum = (value?: number | null) => {
  const [integerPart, decimalPart] = value ? value.toFixed(5).split(".") : ["", ""];
  const smallFontSize = 24;
  const bigFontSize = 42;
  return (
    <Box
      height="100%"
      alignContent="flex-end">
      <Typography
        component="span"
        lineHeight={1}
        sx={{
          color: "white",
          WebkitTextStroke: "1px black",
          fontSize: smallFontSize,
          letterSpacing: 1.3,
          fontWeight: 700,
        }}>
        {integerPart}
      </Typography>

      {Boolean(integerPart.length) && "."}
      {decimalPart.split("").map((digit, index) => {
        if (index === 2 || index === 3) {
          return (
            <Typography
              sx={{ color: "white", WebkitTextStroke: "1px black" }}
              fontSize={bigFontSize}
              lineHeight={1}
              component="span"
              fontWeight={700}
              key={index}>
              {digit}
            </Typography>
          );
        } else {
          return (
            <Typography
              fontWeight={700}
              sx={{ color: "white", WebkitTextStroke: "1px black" }}
              fontSize={smallFontSize}
              component="span"
              lineHeight={1}
              key={index}>
              {digit}
            </Typography>
          );
        }
      })}
    </Box>
  );
};
