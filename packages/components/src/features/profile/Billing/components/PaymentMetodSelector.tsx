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

type Props = StackProps & {
  onAttachCard: (cardData: CardModel) => void;
  onClose: () => void;
};

export const PaymentMetodSelector: FC<Props> = ({ onClose, onAttachCard, ...props }) => {
  const [tab, setTab] = useState<TabsType>("card");
  const { t } = useTranslation("PaymentMetodSelector");
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
        />
      ) : (
        <>
          <Typography fontSize={14} fontWeight={400} variant="h6">{t("ComingSoon")}</Typography>
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
