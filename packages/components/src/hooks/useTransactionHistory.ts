import { useEffect, useMemo, useState } from "react";
import { TransactionHistoryResponse } from '../types/transactions';
import { fetchTransactions } from "../api/transactions";

export function useTransactionHistory(walletAddress: string) {
  // API data state
  const [data, setData] = useState<TransactionHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Filter state
  const [dateFilter, setDateFilter] = useState('all');   // 'all' | '7' | '30' | '90'
  const [typeFilter, setTypeFilter] = useState('all');
  const [tokenFilter, setTokenFilter] = useState('all');
  const [hideSpam, setHideSpam] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Fetch on mount
  useEffect(() => {
  async function load() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchTransactions(walletAddress);
      setData(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  if (walletAddress) {
    load();
  }
}, [walletAddress]);

  
  // Derived: filtered transactions
  const filteredTransactions = useMemo(() => {
    if (!data?.transactions) return [];
    
    return data.transactions.filter(tx => {
      // Spam filter - use ONLY isSpam boolean
      if (hideSpam && tx.spam.isSpam) return false;
      
      // Date filter
      if (dateFilter !== 'all') {
        const days = parseInt(dateFilter);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        if (new Date(tx.timestamp) < cutoff) return false;
      }
      
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      
      // Token filter
      if (tokenFilter !== 'all') {
        const hasToken = tx.transfers.some(t => t.symbol === tokenFilter);
        if (!hasToken) return false;
      }
      
      return true;
    });
  }, [data, dateFilter, typeFilter, tokenFilter, hideSpam]);
  
  // Derived: paginated transactions
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, page]);
  
  // Derived: unique token options for filter
  const uniqueTokens = useMemo(() => {
    const tokens = new Set<string>();
    data?.transactions.forEach(tx => 
      tx.transfers.forEach(t => tokens.add(t.symbol))
    );
    return Array.from(tokens).sort();
  }, [data]);
  
  // Derived: spam count
  const spamCount = useMemo(() => 
    data?.transactions.filter(tx => tx.spam.isSpam).length ?? 0
  , [data]);
  
  return {
    // Data
    data,
    loading,
    error,
    
    // Transactions
    filteredTransactions,
    paginatedTransactions,
    
    // Filters
    dateFilter, setDateFilter,
    typeFilter, setTypeFilter,
    tokenFilter, setTokenFilter,
    hideSpam, setHideSpam,
    
    // Filter options
    uniqueTokens,
    
    // Pagination
    page, setPage,
    totalPages: Math.ceil(filteredTransactions.length / itemsPerPage),
    
    // Counts
    totalFiltered: filteredTransactions.length,
    spamCount
  };
}