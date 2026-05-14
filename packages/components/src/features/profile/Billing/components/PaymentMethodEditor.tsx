import { Typography } from "@mui/material";
import { StackProps } from "@mui/system";
import Stack from "@mui/system/Stack";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { CardPaymentForm } from "./CardPaymentForm";
import { CardModel } from "./PaymentMethodSelector";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export type PaymentMethodEditorProps = StackProps & {
  onAttachCard: (cardData: CardModel) => void;
  onClose: () => void;
  number?: string;
  cvc?: string;
  expiry?: string;
  // Aligned with `CardPaymentForm` and `BillingSection` (Stripe-shape
  // payment methods).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentMethods: any[];
};
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

export const PaymentMethodEditor: FC<PaymentMethodEditorProps> = ({
  onClose,
  onAttachCard,
  number,
  cvc,
  expiry,
  paymentMethods,
  ...props
}) => {
  const { t } = useTranslation("PaymentMethodSelector");
  return (
    <Stack
      spacing={3}
      minHeight={"100%"}
      {...props}>
      <Typography variant="h6">{t("Title")}</Typography>
      <Elements stripe={stripePromise}>
        <CardPaymentForm
          paymentMethods={paymentMethods}
          style={{ marginTop: 32 }}
          onClose={onClose}
          onAttachCard={onAttachCard}
        />
      </Elements>
    </Stack>
  );
};
