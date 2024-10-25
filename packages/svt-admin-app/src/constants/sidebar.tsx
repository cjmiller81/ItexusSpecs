import { SidebarItems, SidebarListItem } from "components/src/components/Sidebar/types";
import i18next, { t } from "i18next";

function getUsersItems(): SidebarListItem[] {
  return [
    {
      title: i18next.t("UserList", { ns: "SideBar" }),
      href: "/users/list",
    },
  ];
}

function getStrategiesItems(): SidebarListItem[] {
  return [
    {
      title: i18next.t("FifoStrategy", { ns: "SideBar" }),
      open: false,
      children: [
        {
          title: t("FifoUsers", { ns: "SideBar" }),
          href: "/strategies/fifo/users",
        },
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
      ],
    },
    {
      title: i18next.t("IvlStrategy", { ns: "SideBar" }),
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
    {
      title: i18next.t("ZeroDteStrategy", { ns: "SideBar" }),
      open: false,
      children: [
        {
          title: t("ZeroDteUsers", { ns: "SideBar" }),
          href: "/strategies/zero-dte/users",
        },
        {
          title: t("ZeroDteReports", { ns: "SideBar" }),
          href: "/strategies/zero-dte/reports",
        },
      ],
    },
  ];
}

export function getSidebarMenuItems(): SidebarItems[] {
  return [
    {
      title: t("Users", { ns: "SideBar" }),
      sidebarListItems: getUsersItems(),
    },
    {
      title: t("Strategies", { ns: "SideBar" }),
      sidebarListItems: getStrategiesItems(),
    },
  ];
}
