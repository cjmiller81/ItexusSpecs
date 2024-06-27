import { FormattedMessage } from "react-intl"
import { NavItemType } from "types/menu"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

const admin: NavItemType = {
  id: "group-forms-tables-2",
  title: <FormattedMessage id="admin" />,
  type: "group",
  children: [
    {
      id: "accounting",
      title: <FormattedMessage id="accounting" />,
      type: "collapse",
      icon: AdminPanelSettingsIcon,
      children: [
        {
          id: "fireblocks",
          title: <FormattedMessage id="fireblocks" />,
          type: "item",
          breadcrumbs: false,
        }
      ],
    },
    {
      id: "customers",
      title: <FormattedMessage id="customers" />,
      type: "item",
      icon: PersonIcon,
      breadcrumbs: false,
    },
    {
      id: "users",
      title: <FormattedMessage id="users" />,
      type: "item",
      icon: GroupOutlinedIcon,
      breadcrumbs: false,
      url: "/admin/users",
    },
  ],
}

export default admin
