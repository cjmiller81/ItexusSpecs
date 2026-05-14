import { Typography } from "@mui/material";
import { StackProps } from "@mui/system";
import Stack from "@mui/system/Stack";
import i18next from "i18next";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { InferType } from "yup";
import { CardPaymentForm } from "./CardPaymentForm";
import { PaymentTabs, TabsType } from "./PaymentTabs";
import { SaveChancelButtons } from "./SaveChancelButtons";

const requiredError = i18next.t("mandatoryField", { ns: "ErrorMessages" });

const cardModelSchema = Yup.object().shape({
  expiry: Yup.string().trim().length(5, " ").required(requiredError),
  number: Yup.string().trim().length(19, " ").required(requiredError),
  cvc: Yup.string().trim().length(3, " ").required(requiredError),
});

export type CardModel = InferType<typeof cardModelSchema>;

export type PaymentMethodSelectorProps = StackProps & {
  onAttachCard: (cardData: CardModel) => void;
  onClose: () => void;
  // Aligned with `CardPaymentForm` and `BillingSection` which also pass
  // the Stripe payment-methods array as `any[]`. Tightening this here
  // would force the rest of the billing-section refactor.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentMethods: any[];
};

export const PaymentMethodSelector: FC<PaymentMethodSelectorProps> = ({
  onClose,
  onAttachCard,
  paymentMethods,
  ...props
}) => {
  const [tab, setTab] = useState<TabsType>("card");
  const { t } = useTranslation("PaymentMethodSelector");
  return (
    <Stack
      spacing={3}
      minHeight={"100%"}
      {...props}>
      <Typography variant="h6">{t("Title")}</Typography>
      <PaymentTabs
        onTabChange={setTab}
        tab={tab}
      />
      {tab === "card" ? (
        <CardPaymentForm
          onClose={onClose}
          onAttachCard={onAttachCard}
          paymentMethods={paymentMethods}
        />
      ) : (
        <>
          <Typography
            fontSize={14}
            fontWeight={400}
            variant="h6">
            {t("ComingSoon")}
          </Typography>
          <SaveChancelButtons
            disableSaveButton
            sx={{ position: "absolute", bottom: theme => theme.spacing(2), right: theme => theme.spacing(2) }}
            onCancel={onClose}
          />
        </>
      )}
    </Stack>
  );
};
