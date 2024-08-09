import { Typography } from "@mui/material";
import { Stack, StackProps, useTheme } from "@mui/system";
import { FC } from "react";
import { InLargedNumberText } from "./InLargedNumberText";

export type BuySellCellProps = StackProps & {
  title: string;
  value?: number | null;
};

export const PriceCellContent: FC<BuySellCellProps> = ({ title, value, ...props }) => {
  const theme = useTheme();

  return (
    <Stack
      height={"100%"}
      direction="column"
      justifyContent="space-around"
      {...props}>
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

      <InLargedNumberText value={value} />
    </Stack>
  );
};
