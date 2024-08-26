import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const AccountFunding: React.FC = () => {
  const { t } = useTranslation("AccountFunding");
  return (
    <>
      <h3>{t("AccountFunding")}</h3>
      <Typography mt={1}>{t("CommingSoon")}</Typography>
    </>
  );
};

export default AccountFunding;
