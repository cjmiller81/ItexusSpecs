import { Typography } from "@mui/material";
import { StackProps } from "@mui/system";
import Stack from "@mui/system/Stack";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { CardPaymentForm } from "./CardPaymentForm";
import { CardModel } from "./PaymentMetodSelector";

type Props = StackProps & {
  onAttachCard: (cardData: CardModel) => void;
  onClose: () => void;
  number?: string;
  cvc?: string;
  expiry?: string;
};

export const PaymentMethodEditor: FC<Props> = ({ onClose, onAttachCard, number, cvc, expiry, ...props }) => {
  const { t } = useTranslation("PaymentMethodSelector");
  return (
    <Stack
      spacing={3}
      minHeight={"100%"}
      {...props}>
      <Typography variant="h6">{t("Title")}</Typography>

      <CardPaymentForm
        style={{ marginTop: 32 }}
        number={number}
        cvc={cvc}
        expiry={expiry}
        onClose={onClose}
        onAttachCard={onAttachCard}
      />
    </Stack>
  );
};
