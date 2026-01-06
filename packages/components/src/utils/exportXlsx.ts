import * as XLSX from 'xlsx';
import { Transaction } from '../types/transactions';

export function exportTransactionsXlsx(transactions: Transaction[]) {
  const rows = transactions.map(tx => {
    const inflows = tx.transfers.filter(t => t.direction === 'in');
    const outflows = tx.transfers.filter(t => t.direction === 'out');
    
    return {
      'Date': new Date(tx.timestamp).toISOString(),
      'Chain': tx.chainName,
      'Type': tx.type.toUpperCase(),
      'Protocol': tx.protocol || '',
      'Token In': inflows.map(t => t.symbol).join('; ') || '-',
      'Amount In': inflows.map(t => t.amount.toString()).join('; ') || '-',
      'USD In': inflows.map(t => t.usdValue?.toString() ?? '-').join('; ') || '-',
      'Token Out': outflows.map(t => t.symbol).join('; ') || '-',
      'Amount Out': outflows.map(t => t.amount.toString()).join('; ') || '-',
      'USD Out': outflows.map(t => t.usdValue?.toString() ?? '-').join('; ') || '-',
      'Gas USD': tx.gasUsd.toFixed(4),
      'Spam': tx.spam.isSpam ? 'Yes' : 'No',
      'Spam Score': tx.spam.score.toString(),
      'Hash': tx.hash,
      'Explorer URL': tx.explorerUrl
    };
  });
  
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  // Auto-size columns (optional but recommended)
  const colWidths = [
    { wch: 25 },  // Date
    { wch: 15 },  // Chain
    { wch: 12 },  // Type
    { wch: 20 },  // Protocol
    { wch: 15 },  // Token In
    { wch: 15 },  // Amount In
    { wch: 12 },  // USD In
    { wch: 15 },  // Token Out
    { wch: 15 },  // Amount Out
    { wch: 12 },  // USD Out
    { wch: 10 },  // Gas USD
    { wch: 6 },   // Spam
    { wch: 10 },  // Spam Score
    { wch: 68 },  // Hash
    { wch: 80 }   // Explorer URL
  ];
  worksheet['!cols'] = colWidths;
  
  XLSX.writeFile(workbook, 'Wallet Transaction History.xlsx');
}