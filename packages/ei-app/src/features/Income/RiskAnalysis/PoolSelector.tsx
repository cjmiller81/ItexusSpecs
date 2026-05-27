import React, { FC, useState, useEffect, useRef, useCallback, HTMLAttributes } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { PoolData } from '../Models/PoolData';
import { useGetPoolsQuery } from '../DefiApi';
import { toDollarsAmountField } from '../helpers';

const PAGE_SIZE = 50;

interface Props {
  onPoolSelect: (pool: PoolData | null) => void;
  selectedPool: PoolData | null;
}

const projectIconUrl = (project: string) =>
  `${process.env.LAMA_PROJECT_ICONS_URL}/icons/protocols/${project}?w=48&h=48`;

const chainIconUrl = (chain: string) =>
  `${process.env.LAMA_PROJECT_ICONS_URL}/icons/chains/rsz_${chain}?w=48&h=48`;

export const PoolSelector: FC<Props> = ({ onPoolSelect, selectedPool }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [allPools, setAllPools] = useState<PoolData[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filter =
    debouncedSearch.trim().length >= 2
      ? JSON.stringify([
          ['symbol', 'contains', debouncedSearch.trim().toLowerCase()],
          'or',
          ['project', 'contains', debouncedSearch.trim().toLowerCase()],
        ])
      : '[]';

  // Reset pagination when filter changes
  const prevFilterRef = useRef(filter);
  useEffect(() => {
    if (prevFilterRef.current === filter) return;
    prevFilterRef.current = filter;
    setSkip(0);
    setAllPools([]);
    setHasMore(true);
  }, [filter]);

  const { data, isFetching } = useGetPoolsQuery({
    sorter: JSON.stringify([{ selector: 'tvlUsd', desc: true }]),
    filter,
    skip,
    take: PAGE_SIZE,
  });

  // Track skip at effect time to avoid stale closure
  const skipRef = useRef(skip);
  skipRef.current = skip;

  // Merge incoming page into accumulated list
  useEffect(() => {
    if (!data?.data) return;
    const page = data.data;
    const currentSkip = skipRef.current;
    setAllPools((prev) => {
      if (currentSkip === 0) return page;
      const seen = new Set(prev.map((p) => p.pool));
      return [...prev, ...page.filter((p) => !seen.has(p.pool))];
    });
    setHasMore(page.length === PAGE_SIZE);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleListScroll = useCallback(
    (e: React.SyntheticEvent) => {
      const el = e.currentTarget as HTMLElement;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 40 && !isFetching && hasMore) {
        setSkip(allPools.length);
      }
    },
    [isFetching, hasMore, allPools.length],
  );

  return (
    <Autocomplete<PoolData>
      openOnFocus
      options={allPools}
      value={selectedPool}
      loading={isFetching}
      filterOptions={(x) => x}
      isOptionEqualToValue={(a, b) => a.pool === b.pool}
      getOptionLabel={(p) => `${p.symbol} — ${p.project} (${p.chain})`}
      onChange={(_e, pool) => onPoolSelect(pool)}
      onInputChange={(_e, v, reason) => {
        if (reason === 'input') setSearch(v);
        if (reason === 'clear') setSearch('');
      }}
      noOptionsText={isFetching ? 'Loading…' : 'No pools found'}
      sx={{ flex: 1 }}
      ListboxProps={{
        onScroll: handleListScroll,
        style: { maxHeight: 240 },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search pool by symbol or project…"
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isFetching ? <CircularProgress size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, pool) => {
        const { key, ...restProps } = props as HTMLAttributes<HTMLLIElement> & { key: React.Key };
        return (
          <Box
            component="li"
            key={key ?? pool.pool}
            {...restProps}
            sx={{
              display: 'grid',
              gridTemplateColumns: '24px 1fr 1fr 1fr 80px 64px',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              '&[aria-selected="true"]': { bgcolor: 'action.selected' },
              '&.Mui-focused': { bgcolor: 'action.hover' },
            }}
          >
            <img
              src={projectIconUrl(pool.project)}
              alt=""
              width={20}
              height={20}
              style={{ borderRadius: '50%' }}
              onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
            />
            <Typography variant="body2" fontWeight={600} noWrap>
              {pool.symbol}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
              <img
                src={projectIconUrl(pool.project)}
                alt=""
                width={12}
                height={12}
                style={{ borderRadius: '50%', flexShrink: 0 }}
                onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
              />
              <Typography variant="caption" noWrap sx={{ opacity: 0.7 }}>
                {pool.project}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
              <img
                src={chainIconUrl(pool.chain)}
                alt=""
                width={12}
                height={12}
                style={{ borderRadius: '50%', flexShrink: 0 }}
                onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
              />
              <Typography variant="caption" noWrap sx={{ opacity: 0.7 }}>
                {pool.chain}
              </Typography>
            </Box>
            <Typography variant="caption" align="right" noWrap sx={{ opacity: 0.7 }}>
              {toDollarsAmountField(pool.tvlUsd)}
            </Typography>
            <Typography variant="caption" align="right" fontWeight={600} sx={{ color: '#10B981' }} noWrap>
              {pool.apy != null ? `${pool.apy.toFixed(2)}%` : '—'}
            </Typography>
          </Box>
        );
      }}
    />
  );
};
