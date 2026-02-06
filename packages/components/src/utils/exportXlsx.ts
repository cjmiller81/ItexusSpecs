import * as XLSX from 'xlsx';
import { Transaction } from '../types/transactions';

type DateRangeKey = 'all' | 'last_7' | 'last_30' | 'custom';

export interface ExportOptions {
  dateRange: DateRangeKey;
  startDate?: Date;
  endDate?: Date;
  selectedTypes?: string[]; // lowercase
  hideSpam?: boolean;
}

export function exportTransactionsXlsx(transactions: Transaction[], options: ExportOptions = { dateRange: 'all' }) {
  const filtered = applyFilters(transactions, options);
  const expanded = expandTransactions(filtered);

  const rows = expanded.map(r => {
    const d = new Date(r.timestamp);
    return {
      Date: formatDate(d),      // MM/DD/YYYY
      Time: formatTime(d),      // HH:MM:SS
      Chain: r.chainName || '-',
      Type: (r.type || '-').toUpperCase(),
      Protocol: r.protocol || '-',
      'Token In': r.tokenIn || '-',
      'Amount In': r.amountIn || '-',
      'USD In': r.usdIn || '-',
      'Token Out': r.tokenOut || '-',
      'Amount Out': r.amountOut || '-',
      'USD Out': r.usdOut || '-',
      'Gas USD': (typeof r.gasUsd === 'number') ? r.gasUsd.toFixed(4) : '-',
      Spam: r.spam?.isSpam ? 'Yes' : 'No',
      'Spam Score': r.spam?.score?.toString() ?? '-',
      Hash: r.hash || '-',
      'Explorer URL': r.explorerUrl || '-'
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  worksheet['!cols'] = [
    { wch: 12 }, // Date
    { wch: 12 }, // Time
    { wch: 15 }, // Chain
    { wch: 12 }, // Type
    { wch: 20 }, // Protocol
    { wch: 18 }, // Token In
    { wch: 18 }, // Amount In
    { wch: 14 }, // USD In
    { wch: 18 }, // Token Out
    { wch: 18 }, // Amount Out
    { wch: 14 }, // USD Out
    { wch: 10 }, // Gas USD
    { wch: 6 },  // Spam
    { wch: 10 }, // Spam Score
    { wch: 68 }, // Hash
    { wch: 80 }  // Explorer URL
  ];

  XLSX.writeFile(workbook, 'Wallet Transaction History.xlsx');
}

/* Helpers */

function formatDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function formatTime(d: Date): string {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/**
 * Apply date/type/spam filters before exporting.
 */
function applyFilters(transactions: Transaction[], options: ExportOptions): Transaction[] {
  let txs = transactions.slice();

  // Spam
  if (options.hideSpam) {
    txs = txs.filter(t => !(t.spam && t.spam.isSpam));
  }

  // Types - skip filtering if selectedTypes is empty or contains only 'all'
  if (options.selectedTypes && options.selectedTypes.length > 0 && !options.selectedTypes.includes('all')) {
    const set = new Set(options.selectedTypes.map(s => s.toLowerCase()));
    txs = txs.filter(t => !!t.type && set.has(String(t.type).toLowerCase()));
  }

  // Date range
  if (!options || options.dateRange === 'all') return txs;

  let from: Date | undefined;
  let to: Date | undefined = options.endDate ? new Date(options.endDate) : undefined;

  if (options.dateRange === 'custom') {
    from = options.startDate ? new Date(options.startDate) : undefined;
  } else {
    const now = new Date();
    if (options.dateRange === 'last_7') {
      from = new Date(now);
      from.setDate(now.getDate() - 6); // include today and 6 previous => 7 days
      to = now;
    } else if (options.dateRange === 'last_30') {
      from = new Date(now);
      from.setDate(now.getDate() - 29);
      to = now;
    }
  }

  if (!from && !to) return txs;

  return txs.filter(t => {
    const ts = new Date(t.timestamp);
    if (from && ts < startOfDay(from)) return false;
    if (to && ts > endOfDay(to)) return false;
    return true;
  });
}

function startOfDay(d: Date) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}
function endOfDay(d: Date) {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

/**
 * Expand a single Transaction into multiple export-rows so that each row contains
 * at most one Token/Amount/USD for in/out. Pair in/out by index when possible,
 * otherwise fill missing cells with '-'.
 */
function expandTransactions(transactions: Transaction[]) {
  const result: any[] = [];

  transactions.forEach(tx => {
    const inflows = tx.transfers?.filter(t => t.direction === 'in') ?? [];
    const outflows = tx.transfers?.filter(t => t.direction === 'out') ?? [];

    const tokensIn = inflows.map(t => t.symbol ?? '-');
    const amountsIn = inflows.map(t => (t.amount !== undefined ? String(t.amount) : '-'));
    const usdIn = inflows.map(t => (t.usdValue !== undefined ? Number(t.usdValue).toFixed(4) : '-'));

    const tokensOut = outflows.map(t => t.symbol ?? '-');
    const amountsOut = outflows.map(t => (t.amount !== undefined ? String(t.amount) : '-'));
    const usdOut = outflows.map(t => (t.usdValue !== undefined ? Number(t.usdValue).toFixed(4) : '-'));

    const max = Math.max(tokensIn.length, tokensOut.length, 1);

    for (let i = 0; i < max; i++) {
      result.push({
        ...tx,
        // keep original timestamp/type/etc on each expanded row
        tokenIn: tokensIn[i] ?? '-',
        amountIn: amountsIn[i] ?? '-',
        usdIn: usdIn[i] ?? '-',
        tokenOut: tokensOut[i] ?? '-',
        amountOut: amountsOut[i] ?? '-',
        usdOut: usdOut[i] ?? '-',
      });
    }
  });

  return result;
}