import i18next, { t } from "i18next";
import HomeIcon from "@mui/icons-material/Home";
import { SidebarItems, SidebarListItem } from "components/src/components/Sidebar/types";
import { Theme } from "@mui/system";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

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

function getEquityOptionsItems(): SidebarListItem[] {
  return [
    {
      title: t("ConversionPositions", { ns: "SideBar" }),
      icon: <FormatListBulletedIcon />,
      href: "/conversions",
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
      title: t("EquityOptions", { ns: "SideBar" }),
      sidebarListItems: getEquityOptionsItems(),
    },
  ];
}