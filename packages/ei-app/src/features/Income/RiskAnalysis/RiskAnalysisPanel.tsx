import React, { FC, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PoolData } from '../Models/PoolData';
import { PoolChartPoint } from '../Models/PoolChartPoint';
import { useGetProtocolMetaQuery, useGetChartDataQuery } from '../DefiApi';
import { scorePool } from './riskScoring';
import { PillarCard } from './PillarCard';
import { RiskFlagsCard } from './RiskFlagsCard';
import { PoolSelector } from './PoolSelector';
import { RiskBand } from './types';
import { toDollarsAmountField } from '../helpers';

const BAND_COLOR: Record<RiskBand, string> = {
  excellent: '#10B981',
  strong: '#22C55E',
  moderate: '#F59E0B',
  caution: '#F97316',
  high_risk: '#EF4444',
};

const BAND_LABEL: Record<RiskBand, string> = {
  excellent: 'EXCELLENT',
  strong: 'STRONG',
  moderate: 'MODERATE',
  caution: 'CAUTION',
  high_risk: 'HIGH RISK',
};

const NOT_SCORED_ITEMS = [
  'Oracle design & feed diversity',
  'Contract verification & source provenance',
  'Underlying chain validator-set security',
  'Admin keys / timelock & upgradeability',
  'Strategy / vault harvest cadence',
  'Incident & exploit history',
];

interface PoolMetaCardProps {
  pool: PoolData;
}

const PoolMetaCard: FC<PoolMetaCardProps> = ({ pool }) => {
  const projectIconUrl = `${process.env.LAMA_PROJECT_ICONS_URL}/icons/protocols/${pool.project}?w=48&h=48`;
  const chainIconUrl = `${process.env.LAMA_PROJECT_ICONS_URL}/icons/chains/rsz_${pool.chain}?w=48&h=48`;

  const rows: Array<[string, string, string, string]> = [
    ['Chain', pool.chain, 'Category', pool.category ?? '—'],
    ['TVL', toDollarsAmountField(pool.tvlUsd) || '—', 'APY', pool.apy != null ? `${pool.apy.toFixed(2)}%` : '—'],
    ['APY Base', pool.apyBase != null ? `${pool.apyBase.toFixed(2)}%` : '—', 'APY Reward', pool.apyReward != null ? `${pool.apyReward.toFixed(2)}%` : '—'],
    ['APY Mean 30d', pool.apyMean30d != null ? `${pool.apyMean30d.toFixed(2)}%` : '—', 'IL Risk', pool.ilRisk ?? '—'],
    ['Exposure', pool.exposure ?? '—', 'Stablecoin', pool.stablecoin ? 'Yes' : 'No'],
  ];

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Stack direction="row" gap={3} alignItems="flex-start" flexWrap="wrap">
        {/* Pool identity */}
        <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 160 }}>
          <img
            src={projectIconUrl}
            alt={pool.project}
            width={36}
            height={36}
            style={{ borderRadius: '50%' }}
            onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
          />
          <Box>
            <Typography variant="body2" fontWeight={700}>{pool.symbol}</Typography>
            <Stack direction="row" alignItems="center" gap={0.5} mt={0.25}>
              <img
                src={chainIconUrl}
                alt={pool.chain}
                width={12}
                height={12}
                style={{ borderRadius: '50%' }}
                onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
              />
              <Typography variant="caption" sx={{ opacity: 0.6 }}>{pool.project}</Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Data grid: label · value · label · value */}
        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto 1fr',
            columnGap: 2.5,
            rowGap: 0.6,
            minWidth: 280,
          }}
        >
          {rows.map(([l1, v1, l2, v2]) => (
            <React.Fragment key={l1}>
              <Typography
                variant="caption"
                sx={{ opacity: 0.5, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: 0.4, whiteSpace: 'nowrap', alignSelf: 'center' }}
              >
                {l1}
              </Typography>
              <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.75rem', alignSelf: 'center' }}>
                {v1}
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.5, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: 0.4, whiteSpace: 'nowrap', alignSelf: 'center' }}
              >
                {l2}
              </Typography>
              <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.75rem', alignSelf: 'center' }}>
                {v2}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

interface Props {
  initialPool?: PoolData | null;
}

export const RiskAnalysisPanel: FC<Props> = ({ initialPool }) => {
  const [selectedPool, setSelectedPool] = useState<PoolData | null>(initialPool ?? null);

  const { data: metaData, isFetching: metaFetching } = useGetProtocolMetaQuery(
    selectedPool?.project ?? '',
    { skip: !selectedPool },
  );

  const { data: chartData, isFetching: chartFetching } = useGetChartDataQuery(
    selectedPool?.pool ?? '',
    { skip: !selectedPool },
  );

  const isLoading = metaFetching || chartFetching;

  const chartPoints: PoolChartPoint[] = chartData?.data ?? [];
  const meta = metaData ?? null;

  const scoring = useMemo(() => {
    if (!selectedPool || metaFetching || chartFetching) return null;
    return scorePool(selectedPool, meta, chartPoints);
  }, [selectedPool, meta, chartPoints, metaFetching, chartFetching]);

  const theme = useTheme();
  const bandColor = scoring ? BAND_COLOR[scoring.band] : undefined;
  const headerTextColor = theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      {/* Search */}
      <PoolSelector onPoolSelect={setSelectedPool} selectedPool={selectedPool} />

      {/* Pool meta card — full width, below search */}
      {selectedPool && <PoolMetaCard pool={selectedPool} />}

      {/* Loading state */}
      {isLoading && selectedPool && (
        <Stack alignItems="center" py={4} gap={1}>
          <CircularProgress size={28} />
          <Typography variant="caption" sx={{ opacity: 0.6 }}>Loading analysis…</Typography>
        </Stack>
      )}

      {/* Results */}
      {!isLoading && scoring && (
        <>
          {/* Composite Safety Rating */}
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderLeft: `4px solid ${bandColor}`,
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1.5}>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, opacity: 0.6 }}>
                Composite Safety Rating
              </Typography>
              <Chip
                label={BAND_LABEL[scoring.band]}
                size="small"
                sx={{
                  background: `${bandColor}22`,
                  color: bandColor,
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 22,
                  border: `1px solid ${bandColor}44`,
                }}
              />
            </Stack>

            <Stack direction="row" alignItems="flex-end" gap={1.5} mb={1.5}>
              <Typography variant="h2" fontWeight={700} sx={{ color: bandColor, lineHeight: 1 }}>
                {scoring.composite}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.4, mb: 0.25 }}>/100</Typography>
              <Typography variant="body1" sx={{ ml: 1, opacity: 0.55, mb: 0.3 }}>
                {scoring.compositeOutOf10}/10
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={scoring.composite}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(148,163,184,0.15)',
                mb: 1.5,
                '& .MuiLinearProgress-bar': { bgcolor: bandColor, borderRadius: 4 },
              }}
            />

            <Stack direction="row" gap={2}>
              <Stack direction="row" alignItems="center" gap={0.75}>
                <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '0.7rem' }}>Data coverage</Typography>
                <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>{scoring.dataCoveragePct}%</Typography>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack direction="row" alignItems="center" gap={0.75}>
                <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '0.7rem' }}>Active flags</Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ fontSize: '0.7rem', color: scoring.flags.length > 0 ? '#EF4444' : '#10B981' }}
                >
                  {scoring.flags.length}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Risk Pillars */}
          <Box>
            <Stack direction="row" alignItems="center" gap={0.75} mb={1.5}>
              <SecurityOutlinedIcon sx={{ fontSize: 14, color: headerTextColor }} />
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, color: headerTextColor }}>
                Risk Pillars
              </Typography>
            </Stack>
            <Grid container spacing={2} alignItems="stretch">
              {scoring.pillars.map((pillar) => (
                <Grid item xs={12} md={6} key={pillar.key} sx={{ display: 'flex' }}>
                  <PillarCard pillar={pillar} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Flags */}
          <RiskFlagsCard flags={scoring.flags} />

          {/* Methodology */}
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <Stack
              direction="row"
              alignItems="center"
              gap={0.75}
              sx={{ px: 2, py: 1.25, bgcolor: '#10B981', borderBottom: '1px solid rgba(0,0,0,0.15)' }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 14, color: '#fff' }} />
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, color: '#fff' }}>
                Methodology &amp; Limits
              </Typography>
            </Stack>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="caption" sx={{ lineHeight: 1.8, display: 'block', opacity: 0.75 }}>
                The composite is a <strong>weighted average</strong> of six orthogonal risk pillars, each scored 0–100
                (higher = safer) from live market data: pool statistics, per-pool APY/TVL history, and protocol-level
                metadata. Pillars with missing inputs are excluded and their weight is redistributed — the{' '}
                <strong>Data coverage</strong> figure reflects how much of the model was backed by real data.
              </Typography>

              <Box
                sx={{
                  mt: 1.5,
                  p: 1.5,
                  bgcolor: 'rgba(148,163,184,0.06)',
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ display: 'block', mb: 0.75, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 0.4 }}
                >
                  Not scored — Verify off-platform
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, opacity: 0.6, lineHeight: 1.7 }}>
                  These materially affect pool safety but have no reliable on-chain data source. Confirm them yourself before sizing in:
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
                  {NOT_SCORED_ITEMS.map((item) => (
                    <Stack key={item} direction="row" alignItems="flex-start" gap={0.75}>
                      <Typography variant="caption" sx={{ opacity: 0.4, lineHeight: 1.8, flexShrink: 0 }}>·</Typography>
                      <Typography variant="caption" sx={{ lineHeight: 1.8, opacity: 0.65 }}>{item}</Typography>
                    </Stack>
                  ))}
                </Box>
              </Box>

              <Typography variant="caption" sx={{ display: 'block', mt: 1.25, opacity: 0.45, fontStyle: 'italic' }}>
                Not investment advice. Scores are a screening tool only, not a guarantee — on-chain risk can change faster than any feed.
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {/* Empty state */}
      {!selectedPool && (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.45 }}>
            Select a pool above to run the composite safety analysis.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
