import { Wallet } from "@/models/Wallet/Wallet"

export const mockWallets: Wallet[] = [
  {
    chainAssets: [
      {
        tokenDetails: [
          {
            id: "ethereum",
            mCap: 192084034300,
            price: 1597.47,
            sym: "eth",
          },
          {
            id: "bridged-usd-coin-linea",
            mCap: 0.0,
            price: 0.999654,
            sym: "usdc",
          },
        ],
        chain: 0,
        walletAssets: [
          {
            tokenName: "ETH",
            balance: 0.035,
            tokenAddress: null,
          },
          {
            tokenName: "USDC",
            balance: 0.001,
            tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          },
        ],
      },
    ],
    isValid: true,
    address: "0x2501c477d0a35545a387aa4a3eee4292a9a8b3f0",
    walletId: "a6c845e9-dd5d-4ec6-b487-b6312c82bb68",
  },
]
