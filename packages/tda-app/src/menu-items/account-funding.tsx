import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import { FormattedMessage } from "react-intl"
import { NavItemType } from "types/menu"

const accountFunding: NavItemType = {
  id: "group-forms-tables-1",
  title: <FormattedMessage id="account-management" />,
  type: "group",
  children: [
    {
      id: "account-funding",
      title: <FormattedMessage id="account-funding" />,
      type: "collapse",
      icon: AccountBalanceWalletIcon,
      children: [
        {
          id: "crypto",
          title: <FormattedMessage id="crypto" />,
          type: "item",
          breadcrumbs: false,
        },
        {
          id: "flat",
          title: <FormattedMessage id="flat" />,
          type: "item",
          breadcrumbs: false,
        },
      ],
    },
    {
      id: "account-history",
      title: <FormattedMessage id="account-history" />,
      type: "item",
      icon: AccountBalanceWalletIcon,
      breadcrumbs: false,
    },
  ],
}

export default accountFunding
