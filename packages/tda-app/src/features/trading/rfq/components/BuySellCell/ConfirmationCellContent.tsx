import { Typography } from "@mui/material";
import { Stack, StackProps, useTheme } from "@mui/system";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyledButton } from "./CellButton";

export type BuySellCellProps = StackProps & {
  confirmationText?: string;
  isQuoteSubmitting?: boolean;
  onYes: () => void;
  onNo: () => void;
};

export const ConfirmationCellContent: FC<BuySellCellProps> = ({
  confirmationText,
  onYes,
  onNo,
  isQuoteSubmitting,
  ...props
}) => {
  const theme = useTheme();
  const { t } = useTranslation("ConfirmationCellContent");
  return (
    <Stack
      height={"100%"}
      direction="column"
      justifyContent={"space-between"}
      {...props}>
      <Typography
        color={theme.palette.common.white}
        fontSize={13}
        fontWeight={600}
        letterSpacing={1}
        textAlign={"center"}
        sx={{
          textDecoration: "underline",
        }}
        whiteSpace="pre-line">
        {t("TradeConfirmation")}
      </Typography>
      <Typography
        color={theme.palette.common.white}
        fontSize={10}
        textAlign={"center"}
        whiteSpace="pre-line">
        {confirmationText}
      </Typography>

      <Stack
        direction={"row"}
        justifyContent={"center"}
        spacing={1}>
        <StyledButton
          onClick={event => {
            event.stopPropagation();
            onNo();
          }}>
          {t("No", { ns: "Common" })}
        </StyledButton>
        <StyledButton
          loading={isQuoteSubmitting}
          onClick={onYes}>
          {!isQuoteSubmitting && t("Yes", { ns: "Common" })}
        </StyledButton>
      </Stack>
    </Stack>
  );
};
