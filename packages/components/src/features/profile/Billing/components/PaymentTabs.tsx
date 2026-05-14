import AppleIcon from "@mui/icons-material/Apple";
import PaymentIcon from "@mui/icons-material/Payment";
import { Typography } from "@mui/material";
import Stack from "@mui/system/Stack";
import { StackProps } from "@mui/system";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { SelectableButton } from "./SelectableButton";
import { GooglePaySvg } from "./GooglePaySvg";

export type TabsType = "card" | "apple-pay" | "google-pay" | "crypto";

export type PaymentTabsProps = StackProps & {
  tab: TabsType;
  onTabChange: (tab: TabsType) => void;
};

export const PaymentTabs: FC<PaymentTabsProps> = ({ tab, onTabChange, ...rest }) => {
  const { t } = useTranslation("PaymentTabs");
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      {...rest}>
      <SelectableButton
        onClick={() => onTabChange("card")}
        selected={tab === "card"}>
        <ButtonContent
          icon={<PaymentIcon />}
          text={t("Card")}
        />
      </SelectableButton>
      {/* <SelectableButton
        onClick={() => onTabChange("apple-pay")}
        selected={tab === "apple-pay"}>
        <ButtonContent
          icon={<AppleIcon />}
          text={t("ApplePay")}
        />
      </SelectableButton>
      <SelectableButton
        onClick={() => onTabChange("google-pay")}
        selected={tab === "google-pay"}>
        <ButtonContent
          icon={
            <GooglePaySvg isSelected={tab === "google-pay"} style={{paddingTop: 4}}/>
          }
          text={t("GooglePay")}
        />
      </SelectableButton> */}
      <SelectableButton
        onClick={() => onTabChange("crypto")}
        selected={tab === "crypto"}>
        {t("Crypto")}
      </SelectableButton>
    </Stack>
  );
};

export const ButtonContent: FC<{ icon: JSX.Element; text: string }> = ({ text, icon }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={0.5}>
      <Typography
        fontWeight="inherit"
        fontSize="inherit"
        variant="body1">
        {text}
      </Typography>
      {icon}
    </Stack>
  );
};
