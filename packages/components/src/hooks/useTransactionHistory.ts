import { useEffect, useMemo, useState } from "react";
import { TransactionHistoryResponse } from '../types/transactions';
import { fetchTransactions } from "../api/transactions";

type DateRange = { from: string; to: string };
type DateFilter = 'all' | DateRange | string; // string kept for backward compatibility ('7','30','90')

export function useTransactionHistory(walletAddress: string) {
  // API data state
  const [data, setData] = useState<TransactionHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Filter state
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');   // 'all' | '7' | '30' | '90' | {from,to}
  const [typeFilter, setTypeFilter] = useState('all');
  const [tokenFilter, setTokenFilter] = useState('all');
  const [hideSpam, setHideSpam] = useState(true);
  
  // Server-side pagination state (server expects `page` and `pageSize`)
  // server page is 0-based by default; initialize to 0
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(50); // default server pageSize

  // Fetch on mount and when walletAddress / dateFilter / page / pageSize / hideSpam change
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, any> = { page, pageSize };
        if (walletAddress) {
          if (dateFilter && dateFilter !== 'all' && typeof dateFilter !== 'string') {
            params.fromDate = dateFilter.from;
            params.toDate = dateFilter.to;
          } else if (typeof dateFilter === 'string' && dateFilter !== 'all') {
            params.days = dateFilter;
          }
        }

        // includeSpam = true when we SHOW spam (hideSpam === false)
        // default includeSpam = false matches hideSpam === true
        params.includeSpam = !hideSpam;

        // fetchTransactions expects a single object param — pass address + params together
        const response = await fetchTransactions({ address: walletAddress, ...params });
        if (!mounted) return;
        setData(response);
        // update pageSize from server if provided
        if (response?.pageSize && response.pageSize !== pageSize) {
          setPageSize(response.pageSize);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err as Error);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    if (walletAddress) {
      load();
    } else {
      // clear if no address
      setData(null);
      setLoading(false);
    }

    return () => { mounted = false; };
  }, [walletAddress, dateFilter, page, pageSize, hideSpam]); // <-- added hideSpam

  // When the spam toggle changes, reset to first server page so the refetch uses page=0 immediately
  useEffect(() => {
    setPage(0);
  }, [hideSpam]);

  // Use server-provided transactions as paginated result
  const paginatedTransactions = useMemo(() => {
    return data?.transactions ?? [];
  }, [data]);

  // Derived counts and paging info from server response
  const totalCount = data?.totalCount ?? 0;
  const filteredCount = data?.filteredCount ?? (data?.totalCount ?? 0);
  const spamCount = data?.spamCount ?? 0;
  const serverPage = data?.page ?? page;
  const serverPageSize = data?.pageSize ?? pageSize;
  const hasMore = data?.hasMore ?? false;
  const totalPages = Math.max(1, Math.ceil(filteredCount / (serverPageSize || 1)));

  // Derived: unique token options for filter (from returned page(s))
  const uniqueTokens = useMemo(() => {
    const tokens = new Set<string>();
    data?.transactions.forEach(tx => 
      tx.transfers.forEach(t => tokens.add(t.symbol))
    );
    return Array.from(tokens).sort();
  }, [data]);

  const [allDateFilterRange, setAllDateFilterRange] = 
    useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });

  // TODO: Optimization way: move getting oldest/newest date for All preset to the BE side in future
  useEffect(() => {
    if (!data || (allDateFilterRange.from && allDateFilterRange.to)) return;
    const loadLastPage = async () => {
      const targetPage = totalPages - 1;
      if (targetPage === 0) return; // already have all data in first page
      
      const params: Record<string, any> = { page: targetPage, pageSize, includeSpam: !hideSpam };
      const response = await fetchTransactions({ address: walletAddress, ...params });
      const oldestDate = response?.transactions[response?.transactions?.length - 1]?.timestamp;
      setAllDateFilterRange({ 
        from: oldestDate ? new Date(oldestDate) : undefined, 
        to: data?.transactions[0]?.timestamp ? new Date(data?.transactions[0]?.timestamp) : undefined 
      });
    };
    loadLastPage();

    return () => {
      setAllDateFilterRange({ from: undefined, to: undefined });
    }
  }, [data, walletAddress]);

  return {
    // Data
    data,
    loading,
    error,
    
    // Transactions (server page)
    paginatedTransactions,
    
    // Filters
    dateFilter, setDateFilter,
    typeFilter, setTypeFilter,
    tokenFilter, setTokenFilter,
    hideSpam, setHideSpam,
    allDateFilterRange,
    
    // Filter options
    uniqueTokens,
    
    // Pagination (server-driven)
    page: serverPage,
    setPage,
    pageSize: serverPageSize,
    setPageSize,
    totalPages,
    totalCount,
    filteredCount,
    spamCount,
    hasMore,
  };
}