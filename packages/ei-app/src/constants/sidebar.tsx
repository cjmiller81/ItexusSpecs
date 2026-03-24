import React from "react";
// Direct imports for better tree-shaking and to avoid barrel import issues
import HomeIcon from '@mui/icons-material/Home';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TagIcon from '@mui/icons-material/Tag';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import i18next, { t } from "i18next";
import DiscordIcon from "../../public/discord.svg";
import XIcon from "../../public/x.svg";
import RedditIcon from "../../public/reddit.svg";
import TelegramIcon from "../../public/telegram.svg";
import GitHubIcon from "../../public/gitHub.svg";
import OpenSourceIcon from "../../public/openSource.svg";
import { Theme, useTheme } from "@mui/system";
import { SidebarItems, SidebarListItem } from "components/src/components/Sidebar/types";
import { MergeIcon } from "lucide-react";
import SvgIcon from "@mui/material/SvgIcon";

i18next.setDefaultNamespace("SideBar");

function getHomeItems(): SidebarListItem[] {
  return [
    {
      title: t("Home", { ns: "SideBar" }),
      icon: <HomeIcon sx={{ fontSize: 16.5 }} />,
      open: false,
      href: "/",
    },
  ];
}

function getPlatformsItems(hasPageAccess: (pagePath: string) => boolean): SidebarListItem[] {
  return [
    {
      title: t("Investing", { ns: "SideBar" }),
      icon: <AutoGraphIcon sx={{ fontSize: 16.5 }} />,
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
      icon: <SyncAltIcon sx={{ fontSize: 16.5 }} />,
      children: [
        {
          title: t("TradingSubpage", { ns: "SideBar" }),
          href: "/charts",
          disabled: !hasPageAccess("/charts"),
        },
        // Derivatives removed - see ARCHIVED_FEATURES.md for restoration code
        // {
        //   title: t("Derivatives", { ns: "SideBar" }),
        //   href: "/derivatives",
        //   disabled: !hasPageAccess("/derivatives"),
        // },
      ],
    },
    {
      title: t("Income", { ns: "SideBar" }),
      icon: <CurrencyExchangeIcon sx={{ fontSize: 16.5 }} />,
      children: [
        {
          title: t("LiquidityPools", { ns: "IncomeSection" }),
          href: "/liquidity_pools",
          disabled: !hasPageAccess("/liquidity_pools"),
        },
        {
          title: t("Vaults", { ns: "IncomeSection" }),
          href: "/vaults",
          disabled: !hasPageAccess("/vaults"),
        }
      ],
    },
  ];
}

function getToolsItems(hasPageAccess: (pagePath: string) => boolean): SidebarListItem[] {
  return [
    {
      title: t("Wallets", { ns: "SideBar" }),
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 16.5 }} />,
      children: [
        {
          title: t("Decentralized", { ns: "SideBar" }),
          href: "/myWallets/decentralized",
          disabled: !hasPageAccess("/myWallets/decentralized"),
        },
        // {
        //   title: t("Centralized", { ns: "SideBar" }),
        //   href: "/myWallets/centralized",
        // },
      ],
    },

    {
      title: t("TradeAggregator", { ns: "SideBar" }),
      icon: <MergeIcon width={16.5}
        height={16.5}
        strokeWidth={2} />,
      children: [
        {
          title: t("DEX", { ns: "SideBar" }),
          href: "/tradeAggregator/dex",
          disabled: !hasPageAccess("/tradeAggregator/dex"),
        },
        {
          title: t("CEX", { ns: "SideBar" }),
          href: "/tradeAggregator/cex",
          disabled: !hasPageAccess("/tradeAggregator/cex"),
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
      icon: <TagIcon sx={{ fontSize: 16.5 }} />,
      href: "/social",
      open: false,
      children: [
        {
          title: t("Telegram", { ns: "SideBar" }),
          icon: (
            <TelegramIcon
              width={18}
              height={18}
              fill={fillColor}
              stroke={fillColor}
            />
          ),
          href: "/social/telegram",
        },
        {
          title: t("X", { ns: "SideBar" }),
          icon: (
            <XIcon
              width={18}
              height={18}
              fill={fillColor}
              stroke={fillColor}
            />
          ),
          href: "/social/twitter",
        },
      ],
    },
    /*
    {
      title: t("OpenSourceCommunity", { ns: "SideBar" }),
      icon: (
        <span style={{ color: fillColor, display: 'flex', alignItems: 'center', width: 16.5, height: 16.5 }}>
          <OpenSourceIcon
            width={16.5}
            height={16.5}
            style={{ width: '16.5px', height: '16.5px', display: 'block' }}
          />
        </span>
      ),
      href: "/community",
      open: false,
      children: [
        {
          title: t("Discord", { ns: "SideBar" }),
          icon: (
            <DiscordIcon
              width={18}
              height={18}
              fill={fillColor}
              stroke={fillColor}
            />
          ),
          href: "/openSource/discord",
        },
        {
          title: t("GitHub", { ns: "SideBar" }),
          icon: (
            <GitHubIcon
              width={18}
              height={18}
              fill={fillColor}
              stroke={fillColor}
            />
          ),
          href: "/openSource/github",
        },
      ],
    },
    */
    {
      title: t("Updates", { ns: "SideBar" }),
      icon: <NotificationsActiveIcon sx={{ fontSize: 16.5 }} />,
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
  ];
}

function getHelpItems(): SidebarListItem[] {
  const ThemedEmailIcon = () => {
    const theme = useTheme();
    const color = theme.palette.mode === "dark" ? "#ffffff" : "#696969";
    return <SvgIcon component={EmailIcon} sx={{ fontSize: 16.5, color }} />;
  };

  const ThemedInfoIcon = () => {
    const theme = useTheme();
    const color = theme.palette.mode === "dark" ? "#ffffff" : "#696969";
    return <SvgIcon component={InfoIcon} sx={{ fontSize: 16.5, color }} />;
  };

  return [
    {
      title: t("Contact", { ns: "SideBar" }),
      icon: <ThemedEmailIcon />,
      open: false,
      href: "mailto:info@elaninsights.com",
    },
    {
      title: t("SupportAndLegal", { ns: "SideBar" }),
      icon: <ThemedInfoIcon />,
      open: false,
      href: "/support",
    },
  ];
}

function getDisclaimerItems(): SidebarListItem[] {
  return [
    {
      title: "Disclaimer",
      children: [
        {
          title: "Elan Insights provides research and analytics only. Nothing on elaninsights.com or elaninsights.io constitutes investment recommendations. Users remain in full control of their own accounts and are solely responsible for their own financial decisions. Please see links to our policies and terms above for further information.",
          href: "/support",
        },
      ],
    },
  ];
}

export function getSidebarMenuItems(theme: Theme, hasPageAccess: (pagePath: string) => boolean): SidebarItems[] {
  return [
    {
      title: t("Home", { ns: "SideBar" }),
      sidebarListItems: getHomeItems(),
    },
    {
      title: t("Platform", { ns: "SideBar" }),
      sidebarListItems: getPlatformsItems(hasPageAccess),
    },

    {
      title: t("Tools", { ns: "SideBar" }),
      sidebarListItems: getToolsItems(hasPageAccess),
    },
    {
      title: t("Community", { ns: "SideBar" }),
      sidebarListItems: getCommunityItems(theme),
    },
    {
      title: t("Help", {ns: "Sidebar"}),
      sidebarListItems: getHelpItems(),
    },
    {
      title: "",
      sidebarListItems: getDisclaimerItems(),
      isDisclaimer: true,
    },
  ];
}
