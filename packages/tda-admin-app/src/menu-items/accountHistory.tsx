import { FormattedMessage } from "react-intl";
import { NavItemType } from "types/menu";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";

const accountHistory: NavItemType = {
  id: "group-forms-tables-1",
  title: <FormattedMessage id="account-history" />,
  type: "group",
  children: [
    {
      id: "trade-history",
      title: <FormattedMessage id="trade-history" />,
      type: "item",
      icon: AssignmentOutlinedIcon,
      breadcrumbs: false,
      url: "/account/trade_history",
    },
    {
      id: "settlement-history",
      title: <FormattedMessage id="settlement-history" />,
      type: "item",
      icon: LibraryBooksOutlinedIcon,
      breadcrumbs: false,
      url: "/account/settlement_history",
    },
  ],
};

export default accountHistory;
