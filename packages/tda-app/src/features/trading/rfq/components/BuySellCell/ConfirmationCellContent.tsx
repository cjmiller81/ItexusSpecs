import { Grid, SxProps, Theme, Typography } from "@mui/material";
import { Stack, StackProps, useTheme } from "@mui/system";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { CellButton } from "./CellButton";

export type BuySellCellProps = StackProps & {
  confirmationText?: string;
  isQuoteSubmitting?: boolean;
  onYes: () => void;
  onNo: () => void;
  cellType: "buy" | "sell";
};

export const ConfirmationCellContent: FC<BuySellCellProps> = ({
  confirmationText,
  onYes,
  onNo,
  isQuoteSubmitting,
  cellType,
  ...props
}) => {
  const theme = useTheme();
  const { t } = useTranslation("ConfirmationCellContent");

  const leftBordered: SxProps<Theme> = {
    borderStartEndRadius: "0px",
    borderEndStartRadius: "0px",
  };

  const rightBordered: SxProps<Theme> = {
    borderEndEndRadius: "0px",
    borderStartStartRadius: "0px",
  };

  return (
    <Stack
      width="100%"
      height={"100%"}
      direction="column"
      justifyContent={"space-between"}
      {...props}>
      <Typography
        color={theme.palette.common.white}
        fontWeight={600}
        letterSpacing={1}
        textAlign={"center"}
        sx={{
          textDecoration: "underline",
          fontSize: 10,
          [theme.breakpoints.down("sm")]: {
            fontSize: 8,
          },
        }}
        whiteSpace="pre-line">
        {t("TradeConfirmation").toUpperCase()}
      </Typography>
      <Typography
        color={theme.palette.common.white}
        sx={{
          fontSize: 11.2,
          [theme.breakpoints.down("sm")]: {
            fontSize: 8,
          },
        }}
        textAlign={"center"}
        whiteSpace="pre-line">
        {confirmationText}
      </Typography>

      <Grid
        width="100%"
        container
        justifyContent="space-between"
        spacing={0}>
        <Grid
          item
          xs={6}
          order={cellType === "buy" ? 0 : 1}>
          <CellButton
            yesNo
            cellType={cellType}
            sx={{
              ...(cellType === "sell" ? leftBordered : rightBordered),
            }}
            loading={isQuoteSubmitting}
            onClick={onYes}>
            {!isQuoteSubmitting && t("Yes", { ns: "Common" })}
          </CellButton>
        </Grid>
        <Grid
          item
          xs={6}
          order={cellType === "buy" ? 1 : 0}>
          <CellButton
            cellType={cellType}
            sx={{
              ...(cellType === "buy" ? leftBordered : rightBordered),
            }}
            onClick={event => {
              event.stopPropagation();
              onNo();
            }}>
            {t("No", { ns: "Common" })}
          </CellButton>
        </Grid>
      </Grid>
    </Stack>
  );
};
