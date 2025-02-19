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
      title: t("DIShortSaleVolume", { ns: "SideBar" }),
      icon: <AutoGraphIcon />,
      children: [
        {
          title: t("SingleStockView", { ns: "SideBar" }),
          href: "/di_single_stock",
        },
        {
          title: t("HighVolumeDailyScan", {ns: "SideBar"}),
          href: "/di_high_volume_scan"
        },
        {
          title: t("SectorsView", { ns: "SideBar" }),
          href: "/di_sectors",
        },
      ],
    },
  ];
}

function getOptionTraderPageItems(): SidebarListItem[] {
  return [
    {
      title: t("TradingSets", { ns: "SideBar" }),
      icon: <AutoGraphIcon />,
      children: [
        {
          title: t("Calls", { ns: "SideBar" }),
          href: "/optionTrade_calls",
        },
      ],
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    {
      title: t("OptionTrader", { ns: "SideBar" }),
      sidebarListItems: getOptionTraderPageItems(),
    },
  ];
}
