import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BarChartIcon from '@mui/icons-material/BarChart'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import HomeIcon from '@mui/icons-material/Home'
import React from 'react'

type SidebarItemChild = {
  title: string
}

export type SidebarListItem = {
  title: string
  icon: React.ReactNode
  children?: SidebarItemChild[]
  href: string
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
    href: '/investing',
    open: false,
    children: [
      {
        title: 'Market Cap Weighted',
      },
      {
        title: 'Market Cap Equal Weight',
      },
    ],
  },
  {
    title: 'Trading',
    href: '/trading',
    icon: <TrendingUpIcon />,
    open: false,
    children: [
      {
        title: 'Trading subpage',
      },
    ],
  },
  {
    title: 'Income',
    href: '/income',
    icon: <CurrencyExchangeIcon />,
    open: false,
    children: [
      {
        title: 'Income subpage',
      },
    ],
  },
  {
    title: 'Arbitrage',
    href: '/arbitrage',
    icon: <BarChartIcon />,
    open: false,
    children: [
      {
        title: 'Arbitrage subpage',
      },
    ],
  },
]

const TOOLS_ITEMS: SidebarListItem[] = [
  {
    title: 'Portfolios',
    href: '/myWallets',
    icon: <AccountBalanceWalletIcon />,
    open: false,
    children: [
      {
        title: 'My Wallets',
      },
    ],
  },
]

export { PLATFORMS_ITEMS, TOOLS_ITEMS }
