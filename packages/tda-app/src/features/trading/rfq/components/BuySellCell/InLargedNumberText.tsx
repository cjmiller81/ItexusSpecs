import { Typography } from "@mui/material";
import { Box, BoxProps } from "@mui/system";
import { FC } from "react";

type Props = BoxProps & {
  value?: number | null;
};

export const InLargedNumberText: FC<Props> = ({value}) => {
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
