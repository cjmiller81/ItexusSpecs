import { WalletAsset } from '@/models/Wallet/walletAsset'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

export const tokensColumns: GridColDef[] = [
  {
    field: 'token',
    headerName: 'Token',
    width: 90,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    valueGetter: (params: GridValueGetterParams) => {
      return params.row.amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      })
    },
    width: 100,
  },
  {
    field: 'price',
    headerName: 'Price',
    valueGetter: (params: GridValueGetterParams) => {
      return params.row.amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      })
    },
    width: 200,
  },
  {
    field: 'usdValue',
    headerName: 'USD Value',
    valueGetter: (params: GridValueGetterParams) => {
      const value = params.row.amount * params.row.price
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    },
    width: 300,
  },
]

export const tokensRows: WalletAsset[] = [
  {
    address: '0x11111111111111111111111111111',
    assets: [
      {
        id: 1,
        token: 'ETH',
        amount: 1.663,
        price: 1612.99,
        usdValue: 2683.5,
      },
      {
        id: 2,
        token: 'USDC',
        amount: 2313.87233123,
        price: 1.0,
        usdValue: 2314.8,
      },
      {
        id: 3,
        token: 'BNB',
        amount: 0.9321312321,
        price: 210.8,
        usdValue: 190,
      },
      {
        id: 4,
        token: 'LINK',
        amount: 333.33,
        price: 7.47,
        usdValue: 3.07,
      },
      {
        id: 5,
        token: 'LTC',
        amount: 47.42,
        price: 64.89,
        usdValue: 3.07,
      },
    ],
  },
  {
    address: '0x22222222222222222222222222',
    assets: [
      {
        id: 1,
        token: 'ETH',
        amount: 1.663,
        price: 1612.99,
        usdValue: 2683.5,
      },
      {
        id: 2,
        token: 'USDC',
        amount: 2313.87,
        price: 1.0,
        usdValue: 2314.8,
      },
      {
        id: 3,
        token: 'BNB',
        amount: 0.9,
        price: 210.8,
        usdValue: 190,
      },
      {
        id: 4,
        token: 'LINK',
        amount: 333.33,
        price: 7.47,
        usdValue: 3.07,
      },
      {
        id: 5,
        token: 'LTC',
        amount: 47.42,
        price: 64.89,
        usdValue: 3.07,
      },
    ],
  },
  {
    address: '0x33333333333333333333333333',
    assets: [
      {
        id: 1,
        token: 'ETH',
        amount: 1.663,
        price: 1612.99,
        usdValue: 2683.5,
      },
      {
        id: 2,
        token: 'USDC',
        amount: 2313.87,
        price: 1.0,
        usdValue: 2314.8,
      },
      {
        id: 3,
        token: 'BNB',
        amount: 0.9,
        price: 210.8,
        usdValue: 190,
      },
      {
        id: 4,
        token: 'LINK',
        amount: 333.33,
        price: 7.47,
        usdValue: 3.07,
      },
      {
        id: 5,
        token: 'LTC',
        amount: 47.42,
        price: 64.89,
        usdValue: 3.07,
      },
    ],
  },
]
