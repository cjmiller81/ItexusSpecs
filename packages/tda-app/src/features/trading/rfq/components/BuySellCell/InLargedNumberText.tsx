import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box, BoxProps } from "@mui/system";
import { FC } from "react";

type Props = BoxProps & {
  value?: number | null;
  secondsLeft: number;
};

export const InLargedNumberText: FC<Props> = ({ value, secondsLeft }) => {
  const [integerPart, decimalPart] = value ? value.toFixed(5).split(".") : ["", ""];
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const smallFontSize = isSmall ? 18 : 24;
  const bigFontSize = isSmall ? 31 : 42;
  const color = secondsLeft !== 0 ? "grey" : theme.palette.common.white;
  return (
    <Box
      height="100%"
      alignContent="flex-end">
      <Typography
        component="span"
        lineHeight={1}
        sx={{
          color: color,
          fontSize: smallFontSize,
          letterSpacing: 1.3,
          fontWeight: 700,
        }}>
        {integerPart}
      </Typography>

      <Typography
        fontWeight={700}
        sx={{ color: color }}
        fontSize={smallFontSize}
        component="span"
        lineHeight={1}>
        {Boolean(integerPart.length) && "."}
      </Typography>
      {decimalPart.split("").map((digit, index) => {
        if (index === 2 || index === 3) {
          return (
            <Typography
              sx={{ color: color }}
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
              sx={{ color: color }}
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
