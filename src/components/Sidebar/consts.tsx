import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BarChartIcon from '@mui/icons-material/BarChart'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import HomeIcon from '@mui/icons-material/Home'
import React from 'react'

type SidebarItemChild = {
  title: string
  href: string
}

export type SidebarListItem = {
  title: string
  icon: React.ReactNode
  children?: SidebarItemChild[]
  href?: string
  open: boolean
}

const PLATFORMS_ITEMS: SidebarListItem[] = [
  {
    title: 'Home',
    icon: <HomeIcon />,
    open: false,
    href: '/',
  },
  {
    title: 'Investing',
    icon: <AutoGraphIcon />,
    open: false,
    children: [
      {
        title: 'Market Cap Weighted',
        href: '/investing/marketCapWeighted',
      },
      {
        title: 'Market Cap Equal Weight',
        href: '/investing/marketCapEqualWeighted',
      },
    ],
  },
  {
    title: 'Trading',
    icon: <TrendingUpIcon />,
    open: false,
    children: [
      {
        title: 'Trading subpage',
        href: '/trading',
      },
    ],
  },
  {
    title: 'Income',
    icon: <CurrencyExchangeIcon />,
    open: false,
    children: [
      {
        title: 'Income subpage',
        href: '/income',
      },
    ],
  },
  {
    title: 'Arbitrage',
    icon: <BarChartIcon />,
    open: false,
    children: [
      {
        title: 'Arbitrage subpage',
        href: '/arbitrage',
      },
    ],
  },
]

const TOOLS_ITEMS: SidebarListItem[] = [
  {
    title: 'Portfolios',
    icon: <AccountBalanceWalletIcon />,
    open: false,
    children: [
      {
        title: 'My Wallets',
        href: '/myWallets',
      },
    ],
  },
]

export { PLATFORMS_ITEMS, TOOLS_ITEMS }
