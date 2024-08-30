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
    right: 0,
    borderRadius: cellType === "buy" ? "0 0 4px 0" : "0 0 0 4px",
    fontWeight: 200,
    fontSize: 24,
    zIndex: 1,
  };

  const titleStyles = {
    fontSize: 22,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
    lineHeight: 1,
    fontWeight: 800,
    alignItems: "flex-start",
  };

  return (
    <Stack
      height={"100%"}
      direction="column"
      justifyContent="space-around"
      position="relative"
      sx={{ alignItems: "start" }}
      {...props}>
      {cellType === "buy" ? (
        <>
          <Typography sx={titleStyles}>{title}</Typography>
          {label && (
            <Typography
              sx={labelStyles}
              className="price-label">
              {label}
            </Typography>
          )}
        </>
      ) : (
        <>
          {label && (
            <Typography
              sx={labelStyles}
              className="price-label">
              {label}
            </Typography>
          )}
          <Typography sx={titleStyles}>{title}</Typography>
        </>
      )}

      <InLargedNumberText
        value={value}
        secondsLeft={secondsLeft}
      />
    </Stack>
  );
};
