import PersonIcon from "@mui/icons-material/Person"
import SyncAltIcon from "@mui/icons-material/SyncAlt"
import { SidebarItems, SidebarListItem } from "components/src/components/Sidebar/types"
import i18next, { t } from "i18next"
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';


function getDashboardItems(): SidebarListItem[] {
  return [
    {
      title: i18next.t("Dashboard", { ns: "SideBar" }),
      icon: <HomeIcon />,
      open: false,
      href: "/",
    },
  ]
}

function getFifoStrategiesItems(): SidebarListItem[] {
  return [
    {
      title: i18next.t("FifoStrategy", { ns: "SideBar" }),
      icon: <AccountBalanceWalletIcon />,
      open: false,
      children: [
        {
          title: t("FifoSignals", { ns: "SideBar" }),
          href: "/strategies/fifo/signals",
        },
        {
          title: t("FifoTradeInstruments", { ns: "SideBar" }),
          href: "/strategies/fifo/trade-instruments",
        },
        {
          title: t("FifoReports", { ns: "SideBar" }),
          href: "/strategies/fifo/reports",
        },
        {
          title: t("FifoUsers", { ns: "SideBar" }),
          href: "/strategies/fifo/users",
        },
      ],
    },
  ]
}

function getIvlItems(): SidebarListItem[] {
  return [
    {
      title: i18next.t("IvlStrategy", { ns: "SideBar" }),
      icon: <AccountBalanceWalletIcon />,
      open: false,
      children: [
        {
          title: t("IvlUsers", { ns: "SideBar" }),
          href: "/strategies/ivl/users",
        },
        {
          title: t("IvlReports", { ns: "SideBar" }),
          href: "/strategies/ivl/reports",
        },
      ],
    },
  ]
}

function getUsersItems(): SidebarListItem[] {
  return [
    {
      title: i18next.t("Users", { ns: "SideBar" }),
      icon: <PersonIcon />,
      open: false,
      href: "/users",
    },
  ]
}

export function getSidebarMenuItems(): SidebarItems[] {
  return [
    {
      title: t("Dashboard", { ns: "SideBar" }),
      sidebarListItems: getDashboardItems(),
    },
    {
      title: t("Fifo", { ns: "SideBar" }),
      sidebarListItems: getFifoStrategiesItems(),
    },
    {
      title: t("Ivl", { ns: "SideBar" }),
      sidebarListItems: getIvlItems(),
    },
    {
      title: t("Users", { ns: "SideBar" }),
      sidebarListItems: getUsersItems(),
    },
  ]
}
