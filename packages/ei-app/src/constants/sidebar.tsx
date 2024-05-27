import AutoGraphIcon from "@mui/icons-material/AutoGraph"
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange"
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import HomeIcon from "@mui/icons-material/Home"
import PeopleIcon from "@mui/icons-material/People"
import React from "react"
import i18next, { t } from "i18next"
import { useTheme } from "@mui/material/styles"

i18next.setDefaultNamespace("SideBar")
type SidebarItemChild = {
  title: string
  href: string
  icon?: React.ReactNode
}

export type SidebarListItem = {
  title: string
  icon: React.ReactNode
  children?: SidebarItemChild[]
  href?: string
  open: boolean
}

export type SidebarItems = {
  title: string
  sidebarListItems: SidebarListItem[]
}

function getHomeItems(): SidebarListItem[] {
  return [
    {
      title: t("Home", { ns: "SideBar" }),
      icon: <HomeIcon />,
      open: false,
      href: "/",
    },
  ]
}

function getPlatformsItems(): SidebarListItem[] {
  return [
    {
      title: t("Investing", { ns: "SideBar" }),
      icon: <AutoGraphIcon />,
      open: false,
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
      open: false,
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
      open: false,
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
      open: false,
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

function getCommunityItems(): SidebarListItem[] {
  const theme = useTheme()
  const fillColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#696969';
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
          icon:  <img src="/reddit.svg" alt="Reddit" style={{ width: '24px', height: '24px' }} />,
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

export function getSidebarMenuItems(): SidebarItems[] {
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
      sidebarListItems: getCommunityItems(),
    },
  ]
}
