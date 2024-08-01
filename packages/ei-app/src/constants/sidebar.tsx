import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import React from "react";
import i18next, { t } from "i18next";
import DiscordIcon from "../../public/discord.svg";
import XIcon from "../../public/x.svg";
import RedditIcon from "../../public/reddit.svg";
import GitHubIcon from "../../public/gitHub.svg";
import { Theme } from "@mui/system";
import { SidebarItems, SidebarListItem } from "components/src/components/Sidebar/types";

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

function getPlatformsItems(): SidebarListItem[] {
  return [
    {
      title: t("Investing", { ns: "SideBar" }),
      icon: <AutoGraphIcon />,
      children: [
        {
          title: t("MarketCapWeighted", { ns: "SideBar" }),
          href: "/investing/marketCapWeighted",
        },
        {
          title: t("MarketCapEqualWeight", { ns: "SideBar" }),
          href: "/investing/marketCapEqualWeighted",
        },
      ],
    },
    {
      title: "Trading",
      icon: <SyncAltIcon />,
      children: [
        {
          title: t("TradingSubpage", { ns: "SideBar" }),
          href: "/charts",
        },
      ],
    },
    {
      title: t("Income", { ns: "SideBar" }),
      icon: <CurrencyExchangeIcon />,
      children: [
        {
          title: t("SectionTitle", { ns: "LiquidityPools" }),
          href: "/liquidity_pools",
        },
      ],
    },
  ];
}

function getToolsItems(): SidebarListItem[] {
  return [
    {
      title: t("Portfolios", { ns: "SideBar" }),
      icon: <AccountBalanceWalletIcon />,
      open: false,
      children: [
        {
          title: t("MyWallets", { ns: "SideBar" }),
          href: "/myWallets",
        },
      ],
    },
  ];
}

function getCommunityItems(theme: Theme): SidebarListItem[] {
  const fillColor = theme.palette.mode === "dark" ? "#ffffff" : "#696969";
  return [
    {
      title: t("Community", { ns: "SideBar" }),
      icon: <PeopleIcon />,
      href: "/community",
      open: false,
      children: [
        {
          title: t("Discord", { ns: "SideBar" }),
          icon: (
            <DiscordIcon
              width="21px"
              height="21px"
              fill={fillColor}
              stroke={fillColor}
            />
          ),
          href: "/#",
        },
        {
          title: t("X", { ns: "SideBar" }),
          icon: (
            <XIcon
              width="21px"
              height="21px"
              fill={fillColor}
              stroke={fillColor}
            />
          ),
          href: "/#",
        },
        {
          title: t("Reddit", { ns: "SideBar" }),
          icon: (
            <RedditIcon
              width="24px"
              height="24px"
              fill={fillColor}
              stroke={fillColor}
            />
          ),
          href: "/#",
        },
        {
          title: t("GitHub", { ns: "SideBar" }),
          icon: (
            <GitHubIcon
              width="23px"
              height="23px"
              fill={fillColor}
              stroke={fillColor}
            />
          ),
          href: "/#",
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
      title: t("Platform", { ns: "SideBar" }),
      sidebarListItems: getPlatformsItems(),
    },
    {
      title: t("Tools", { ns: "SideBar" }),
      sidebarListItems: getToolsItems(),
    },
    {
      title: t("Community", { ns: "SideBar" }),
      sidebarListItems: getCommunityItems(theme),
    },
  ];
}
