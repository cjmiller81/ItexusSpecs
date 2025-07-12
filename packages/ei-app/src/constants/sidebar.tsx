import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeIcon from "@mui/icons-material/Home";
import React from "react";
import i18next, { t } from "i18next";
import DiscordIcon from "../../public/discord.svg";
import XIcon from "../../public/x.svg";
import RedditIcon from "../../public/reddit.svg";
import TelegramIcon from "../../public/telegram.svg";
import GitHubIcon from "../../public/gitHub.svg";
import { Theme } from "@mui/system";
import { SidebarItems, SidebarListItem } from "components/src/components/Sidebar/types";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { MergeIcon } from "lucide-react";
import SourceIcon from '@mui/icons-material/Source';
import TagIcon from '@mui/icons-material/Tag';

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

function getPlatformsItems(currentPlan: string | null): SidebarListItem[] {
  const isBasic = currentPlan?.toLowerCase() === "basic";
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
          disabled: isBasic,
        },  
        {
          title: t("Derivatives", { ns: "SideBar" }),
          href: "/derivatives",
          disabled: isBasic,
        },
      ],
    },
    {
      title: t("Income", { ns: "SideBar" }),
      icon: <CurrencyExchangeIcon />,
      children: [
        {
          title: t("LiquidityPools", { ns: "IncomeSection" }),
          href: "/liquidity_pools",
          disabled: isBasic,
        },
        {
          title: t("Vaults", { ns: "IncomeSection" }),
          href: "/vaults",
          disabled: isBasic,
        },
      ],
    },
  ];
}

function getToolsItems(currentPlan: string | null): SidebarListItem[] {
  const isBasic = currentPlan?.toLowerCase() === "basic";
  return [
    {
      title: t("Wallets", { ns: "SideBar" }),
      icon: <AccountBalanceWalletIcon />,
      children: [
        {
          title: t("Decentralized", { ns: "SideBar" }),
          href: "/myWallets/decentralized"
        },
        {
          title: t("Centralized", { ns: "SideBar" }),
          href: "/myWallets/centralized",
        },
      ],
    },

    {
      title: t("TradeAggregator", { ns: "SideBar" }),
      icon: <MergeIcon width="21px"
        height="21px" />,
      children: [
        {
          title: t("DEX", { ns: "SideBar" }),
          href: "/tradeAggregator/dex",
          disabled: isBasic,
        },
        {
          title: t("CEX", { ns: "SideBar" }),
          href: "/tradeAggregator/cex"
        },
      ],
    }
  ];
}

function getCommunityItems(theme: Theme): SidebarListItem[] {
  const fillColor = theme.palette.mode === "dark" ? "#ffffff" : "#696969";

  return [
    {
      title: t("Social", { ns: "SideBar" }),
      icon: <TagIcon />, 
      href: "/social",
      open: false,
      children: [
        {
          title: t("Telegram", { ns: "SideBar" }),
          icon: (
            <TelegramIcon
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
      ],
    },
    {
      title: t("OpenSourceCommunity", { ns: "SideBar" }),
      icon: <SourceIcon />,
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
    {
      title: t("Updates", { ns: "SideBar" }),
      icon: <NotificationsActiveIcon />,
      open: false,
      children: [
        {
          title: t("Blog", { ns: "SideBar" }),
          href: "/blog",
        },
        {
          title: t("Education", { ns: "SideBar" }),
          href: "/education",
        },
      ],
    },
    {
          title: t("SupportAndLegal", { ns: "SideBar" }),
          icon: (
            <TelegramIcon
              width="21px"
              height="21px"
              fill={fillColor}
              stroke={fillColor}
            />
          ),
          href: "/support",
    },
  ];
}

export function getSidebarMenuItems(theme: Theme, currentPlan: string | null): SidebarItems[] {
  return [
    {
      title: t("Home", { ns: "SideBar" }),
      sidebarListItems: getHomeItems(),
    },
    {
      title: t("Platform", { ns: "SideBar" }),
      sidebarListItems: getPlatformsItems(currentPlan),
    },

    {
      title: t("Tools", { ns: "SideBar" }),
      sidebarListItems: getToolsItems(currentPlan),
    },
    {
      title: t("Community", { ns: "SideBar" }),
      sidebarListItems: getCommunityItems(theme),
    },
  ];
}
