import { Typography } from "@mui/material";
import { Stack, StackProps, useTheme } from "@mui/system";
import { FC } from "react";
import { InLargedNumberText } from "./InLargedNumberText";

export type BuySellCellProps = StackProps & {
  title: string;
  secondsLeft: number;
  value?: number | null;
  label?: string | null;
  cellType: "buy" | "sell";
};

export const PriceCellContent: FC<BuySellCellProps> = ({ title, value, label, secondsLeft, cellType, ...props }) => {
  const theme = useTheme();
  const labelStyles = {
    position: "absolute",
    padding: 0,
    top: "-9px",
    left: cellType === "buy" ? 0 : "unset",
    right: cellType === "sell" ? 0 : "unset",
    color: secondsLeft !== 0 ? "grey" : theme.palette.common.white,
    borderRadius: cellType === "buy" ? "0 0 4px 0" : "0 0 0 4px",
    fontWeight: 200,
    fontSize: 24,
    zIndex: 1,
  };
  return (
    <Stack
      height={"100%"}
      direction="column"
      justifyContent="space-around"
      position="relative"
      {...props}>
      {label && <Typography sx={labelStyles}>{label}</Typography>}

      <Typography
        sx={{
          color: secondsLeft !== 0 ? "grey" : theme.palette.common.white,
          fontSize: 22,
          [theme.breakpoints.down("sm")]: {
            fontSize: 16,
          },
          lineHeight: 1,
          fontWeight: 800,
        }}>
        {title}
      </Typography>

      <InLargedNumberText
        value={value}
        secondsLeft={secondsLeft}
      />
    </Stack>
  );
};
