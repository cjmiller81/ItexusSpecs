import { SidebarItems, SidebarListItem } from "components/src/components/Sidebar/types";
import i18next, { t } from "i18next";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PeopleIcon from "@mui/icons-material/People";
import React from "react";

function getUsersItems(): SidebarListItem[] {
  return [
    {
      title: i18next.t("UserList", { ns: "SideBar" }),
      icon: <PeopleIcon />,
      href: "/users/list",
    },
  ];
}

function getStrategiesItems(): SidebarListItem[] {
  return [
    // ***************     TEMPORARY DISABLED  -  DO NOT REMOVE     *************
    {
      title: i18next.t("IvlStrategy", { ns: "SideBar" }),
      icon: <SyncAltIcon />,
      open: false,
      children: [
        {
          title: t("IvlUsers", { ns: "SideBar" }),
          href: "/strategies/ivl/users",
        },
        // {
        //   title: t("IvlReports", { ns: "SideBar" }),
        //   href: "/strategies/ivl/reports",
        // },
      ],
    },
    {
      title: i18next.t("ZeroDteStrategy", { ns: "SideBar" }),
      icon: <CurrencyExchangeIcon />,
      open: false,
      children: [
        {
          title: t("ZeroDteUsers", { ns: "SideBar" }),
          href: "/strategies/zero-dte/users",
        },
        // {
        //   title: t("ZeroDteReports", { ns: "SideBar" }),
        //   href: "/strategies/zero-dte/reports",
        // },
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
