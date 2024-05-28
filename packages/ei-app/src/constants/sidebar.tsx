import AutoGraphIcon from "@mui/icons-material/AutoGraph"
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange"
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import HomeIcon from "@mui/icons-material/Home"
import PeopleIcon from "@mui/icons-material/People"
import React from "react"
import i18next, { t } from "i18next"
import RedditIcon from "../../public/reddit.svg";
import { Theme } from "@mui/system"
import { SidebarItems, SidebarListItem } from "components/src/components/Sidebar/types"
  
i18next.setDefaultNamespace("SideBar")

function getHomeItems(): SidebarListItem[] {
  return [
    {
      title: t("Home", { ns: "SideBar" }),
      icon: <HomeIcon />,
      href: "/",
    },
  ]
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
          href: "/trading",
        },
      ],
    },
    {
      title: t("Income", { ns: "SideBar" }),
      icon: <CurrencyExchangeIcon />,
      children: [
        {
          title: t("IncomeSubpage", { ns: "SideBar" }),
          href: "/income",
        },
      ],
    },
    {
      title: t("Arbitrage", { ns: "SideBar" }),
      icon:  <img src="/arbitrage.svg" alt="Arbitrage" style={{ width: '24px', height: '24px' }} />,
      children: [
        {
          title: t("ArbitrageSubpage", { ns: "SideBar" }),
          href: "/arbitrage",
        },
      ],
    },
  ]
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
  ]
}

  function getCommunityItems(theme: Theme): SidebarListItem[] {
  const fillColor = theme.palette.mode === 'dark' ? 'red' : 'blue';
  return [
    {
      title: t("Community", { ns: "SideBar" }),
      icon: <PeopleIcon />,
      href: "/community",
      open: false,
      children: [
        {
          title: t("Discord", { ns: "SideBar" }),
          icon: <img src="/discord.svg" alt="X" style={{ width: "20px", height: "20px", fill: fillColor}} />,
          href: "/#",
        },
        {
          title: t("X", { ns: "SideBar" }),
          icon: <img src="/x.svg" alt="X" style={{ width: '24px', height: '24px' }} />,
          href: '/#',
        },
        {
          title: t("Reddit", { ns: "SideBar" }),
          icon: <RedditIcon width="24px" height="24px" fill={fillColor} stroke={fillColor}/>,
          href: '/#',
        },
        {
          title: t("GitHub", { ns: "SideBar" }),
          icon: <img src="/gitHub.svg" alt="GitHub" style={{ width: '23px', height: '23px' }} />,
          href: '/#',
        },
      ]
    },
  ]
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
  ]
}
