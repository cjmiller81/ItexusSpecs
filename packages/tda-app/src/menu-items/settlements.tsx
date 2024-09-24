import React from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";
import RequestSettlmentDark from "../../public/requestSettlmentDark.svg";
import RequestSettlmentLight from "../../public/requestSettlmentLight.svg";
import RequestSettlmentBlueDark from "../../public/requestSettlmentBlueDark.svg";
import RequestSettlmentBlueLight from "../../public/requestSettlmentBlueLight.svg";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { NavItemType } from "types/menu";

const LightIcon = () => (
  <RequestSettlmentLight
    width={"15px"}
    height={"15px"}
  />
);

const DarkIcon = () => (
  <RequestSettlmentDark
    width={"15px"}
    height={"15px"}
  />
);

const BlueDarkIcon = () => (
  <RequestSettlmentBlueDark
    width={"15px"}
    height={"15px"}
  />
);

const BlueLightIcon = () => (
  <RequestSettlmentBlueLight
    width={"15px"}
    height={"15px"}
  />
);

const SettlementIcon = () => {
  const theme = useTheme();
  const router = useRouter();
  const isSettlementPage = router.pathname.endsWith("/settlements/request_settlement");

  if (isSettlementPage) {
    return theme.palette.mode === "dark" ? <BlueDarkIcon /> : <BlueLightIcon />;
  } else if (theme.palette.mode === "dark") {
    return <DarkIcon />;
  } else {
    return <LightIcon />;
  }
};

const Settlements: NavItemType = {
  id: "group-forms-tables-1",
  title: <FormattedMessage id="settlements" />,
  type: "group",
  children: [
    {
      id: "request-settlement",
      title: <FormattedMessage id="request-settlement" />,
      type: "item",
      icon: SettlementIcon,
      breadcrumbs: false,
      url: "/settlements/request_settlement",
    },
    {
      id: "funding-instructions",
      title: <FormattedMessage id="funding-instructions" />,
      type: "item",
      icon: FeedOutlinedIcon,
      breadcrumbs: false,
      url: "/settlements/funding_instructions",
    },
    {
      id: "crypto_addresses",
      title: <FormattedMessage id="crypto-addresses" />,
      type: "item",
      icon: ListAltIcon,
      breadcrumbs: false,
      url: "/settlements/crypto_addresses",
    },
    {
      id: "bank_accounts",
      title: <FormattedMessage id="bank-accounts" />,
      type: "item",
      icon: AccountBalanceIcon,
      breadcrumbs: false,
      url: "/settlements/bank_accounts",
    },
  ],
};

export default Settlements;
