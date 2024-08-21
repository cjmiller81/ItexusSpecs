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
  const color = secondsLeft !== 0 ? "#2e2e2e" : theme.palette.common.white;

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
        }}>
        {integerPart}
      </Typography>

      <Typography
        sx={{
          color: color,
          fontSize: smallFontSize,
        }}
        component="span"
        lineHeight={1}>
        {Boolean(integerPart.length) && "."}
      </Typography>

      {decimalPart.split("").map((digit, index) => {
        const fontSize = index === 2 || index === 3 ? bigFontSize : smallFontSize;
        return (
          <Typography
            sx={{
              color: color,
              fontSize: fontSize,
            }}
            component="span"
            lineHeight={1}
            key={index}>
            {digit}
          </Typography>
        );
      })}
    </Box>
  );
};
