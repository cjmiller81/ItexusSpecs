import HomeIcon from "@mui/icons-material/Home";
import React from "react";
import i18next, { t } from "i18next";
import { Theme } from "@mui/system";
import { SidebarItems, SidebarListItem } from "components/src/components/Sidebar/types";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

i18next.setDefaultNamespace("SideBar");

function getHomeItems(): SidebarListItem[] {
  return [
    {
      title: t("Home", { ns: "SideBar" }),
      icon: <HomeIcon />,
      open: false,
      href: "/",
    },
  ];
}

function getDIShortSaleVolumePageItems(): SidebarListItem[] {
  return [
    {
      title: t("DarkPoolsData", { ns: "SideBar" }),
      icon: <AutoGraphIcon />,
      children: [
        {
          title: t("SingleStockView", { ns: "SideBar" }),
          href: "/di_single_stock",
        },
      ],
    },
  ];
}

export function getSidebarMenuItems(theme: Theme): SidebarItems[] {
  return [
    {
      title: t("Home", { ns: "SideBar" }),
      sidebarListItems: getHomeItems(),
    },
    {
      title: t("DarkPoolsData", { ns: "SideBar" }),
      sidebarListItems: getDIShortSaleVolumePageItems(),
    },
  ];
}
