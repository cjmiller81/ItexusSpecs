import { http, HttpResponse } from "msw";
import type { SpamInfo, TokenTransfer, Transaction, TransactionHistoryResponse } from "../types/transactions";

const emptySpam: SpamInfo = { isSpam: false, score: 0, reasons: [] };

const tokenIn: TokenTransfer = {
  symbol: "USDC",
  name: "USD Coin",
  amount: 5000,
  direction: "in",
  logoUrl: null,
  usdValue: 5000,
  contractAddress: "0x0b2c639c533813ac4c66259d21f6bdeb7e9bebc4",
};

const tokenOut: TokenTransfer = {
  symbol: "ETH",
  name: "Ether",
  amount: 1.2,
  direction: "out",
  logoUrl: null,
  usdValue: 3840,
  contractAddress: "0x0000000000000000000000000000000000000000",
};

const txBase = {
  chainId: 1,
  chainName: "eth-mainnet",
  blockNumber: 18_000_000,
  timestamp: "2026-05-10T12:00:00.000Z",
  protocol: null as string | null,
  success: true,
  fromAddress: "0x1111111111111111111111111111111111111111",
  toAddress: "0x2222222222222222222222222222222222222222",
  gasUsed: 210_000,
  gasUsd: 2.15,
  spam: emptySpam,
  explorerUrl: "https://etherscan.io/tx/0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3",
};

const swapTx: Transaction = {
  ...txBase,
  hash: "0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3",
  type: "swap",
  transfers: [tokenIn, tokenOut],
};

const transferTx: Transaction = {
  ...txBase,
  hash: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  type: "transfer",
  transfers: [
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      amount: 100,
      direction: "in",
      logoUrl: null,
      usdValue: 100,
      contractAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
  ],
};

export const STORY_TRANSACTION_WALLET = "0xabc0000000000000000000000000000000000def";

export function makeTransactionHistoryBody(
  overrides?: Partial<TransactionHistoryResponse>,
): TransactionHistoryResponse {
  const transactions = overrides?.transactions ?? [swapTx, transferTx];
  const filteredCount = overrides?.filteredCount ?? transactions.length;
  return {
    walletAddress: STORY_TRANSACTION_WALLET,
    totalCount: overrides?.totalCount ?? filteredCount,
    filteredCount,
    spamCount: overrides?.spamCount ?? 0,
    page: overrides?.page ?? 0,
    pageSize: overrides?.pageSize ?? 50,
    hasMore: overrides?.hasMore ?? false,
    transactions,
    ...overrides,
  };
}

function syncStatusResponse() {
  return HttpResponse.json({
    chains: [
      {
        chain_name: "eth-mainnet",
        last_synced_at: new Date("2026-05-12T10:00:00Z").toISOString(),
        sync_in_progress: false,
      },
    ],
  });
}

/** Match browser `fetch` / `axios` to Storybook regardless of port or query string. */
const walletTransactionsUrl = /\/api\/wallet\/[^/]+\/transactions(?:\?.*)?$/;
const walletSyncStatusUrl = /\/api\/wallet\/[^/]+\/sync-status(?:\?.*)?$/;
const walletSyncPostUrl = /\/api\/wallet\/[^/]+\/sync(?:\?.*)?$/;

function transactionsGetJson(body: TransactionHistoryResponse) {
  return http.get(walletTransactionsUrl, () => HttpResponse.json(body));
}

/** Default: two transactions + sync status (for `TransactionHistory` + sync pill). */
export function transactionHistoryHandlers() {
  return [
    transactionsGetJson(makeTransactionHistoryBody()),
    http.get(walletSyncStatusUrl, syncStatusResponse),
    http.post(walletSyncPostUrl, () =>
      HttpResponse.json({
        chains: [
          {
            chain_name: "eth-mainnet",
            last_synced_at: new Date().toISOString(),
            sync_in_progress: false,
          },
        ],
      }),
    ),
  ];
}

export function transactionHistoryEmptyHandlers() {
  return [
    transactionsGetJson(
      makeTransactionHistoryBody({
        transactions: [],
        totalCount: 0,
        filteredCount: 0,
        spamCount: 0,
        hasMore: false,
      }),
    ),
    http.get(walletSyncStatusUrl, syncStatusResponse),
    http.post(walletSyncPostUrl, () =>
      HttpResponse.json({
        chains: [{ chain_name: "eth-mainnet", last_synced_at: new Date().toISOString(), sync_in_progress: false }],
      }),
    ),
  ];
}

export function transactionHistoryErrorHandlers() {
  return [
    http.get(walletTransactionsUrl, () => HttpResponse.json({ message: "Upstream error" }, { status: 500 })),
    http.get(walletSyncStatusUrl, syncStatusResponse),
    http.post(walletSyncPostUrl, () => HttpResponse.json({ chains: [] })),
  ];
}
