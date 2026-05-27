import { PoolData } from '../Models/PoolData';
import { ProtocolMeta } from '../Models/ProtocolMeta';
import { PoolChartPoint } from '../Models/PoolChartPoint';
import {
  ChartMetrics,
  FlagSeverity,
  PillarResult,
  RiskBand,
  RiskFlag,
  RiskScoringResult,
  Signal,
  SignalStatus,
} from './types';

const STABLECOIN_SYMBOLS = new Set([
  'USDT','USDC','DAI','BUSD','FRAX','LUSD','SUSD','TUSD','USDP','GUSD',
  'USDD','CRVUSD','PYUSD','EURC','USDS','SUSDS','SUSDE',
]);

const PILLAR_WEIGHTS: Record<string, number> = {
  yield_sustainability: 18,
  return_stability: 18,
  liquidity_depth: 20,
  il_composition: 16,
  track_record: 14,
  protocol_counterparty: 14,
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function num(v: number | null | undefined, fallback = 0): number {
  return (v == null || isNaN(v as number)) ? fallback : (v as number);
}

function maxDrawdown(values: number[]): number {
  let peak = -Infinity;
  let maxDD = 0;
  for (const v of values) {
    if (v > peak) peak = v;
    if (peak > 0) {
      const dd = (peak - v) / peak;
      if (dd > maxDD) maxDD = dd;
    }
  }
  return maxDD;
}

export function computeChartMetrics(points: PoolChartPoint[]): ChartMetrics | null {
  const valid = points.filter(p => p.timestamp != null);
  if (valid.length < 3) return null;

  const timestamps = valid.map(p => new Date(p.timestamp).getTime());
  let firstTs = Infinity, lastTs = -Infinity;
  for (const t of timestamps) {
    if (t < firstTs) firstTs = t;
    if (t > lastTs)  lastTs  = t;
  }
  const spanDays = Math.round((lastTs - firstTs) / 86_400_000);

  const cutoff = lastTs - 90 * 86_400_000;
  const recent = valid.filter(p => new Date(p.timestamp).getTime() >= cutoff);

  const tvlValues = recent.map(p => p.tvlUsd).filter((v): v is number => v != null);
  const apyValues = recent.map(p => p.apy).filter((v): v is number => v != null);

  const tvlDrawdown = tvlValues.length >= 3 ? maxDrawdown(tvlValues) : null;
  const apyDrawdown = apyValues.length >= 3 ? maxDrawdown(apyValues) : null;

  return { spanDays, tvlDrawdown, apyDrawdown };
}

export function bandFor(score: number): RiskBand {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'strong';
  if (score >= 55) return 'moderate';
  if (score >= 40) return 'caution';
  return 'high_risk';
}

function sig(label: string, value: string, status: SignalStatus): Signal {
  return { label, value, status };
}

// ── Pillar 1: Yield Sustainability ───────────────────────────────────────────
function scoreYieldSustainability(pool: PoolData): PillarResult {
  const signals: Signal[] = [];
  let penalty = 0;
  let inputs = 0;

  const apy = num(pool.apy);
  const apyReward = pool.apyReward == null ? null : num(pool.apyReward);
  const apyBase = num(pool.apyBase);

  // Signal 1: Emission dependence
  if (apyReward != null && apy > 0) {
    inputs++;
    const ratio = clamp(apyReward / apy, 0, 1);
    let p = 0;
    if (ratio <= 0.1) p = 0;
    else if (ratio <= 0.3) p = 8;
    else if (ratio <= 0.5) p = 18;
    else if (ratio <= 0.8) p = 30;
    else p = 45;
    penalty += p;
    const pct = Math.round(ratio * 100);
    const status: SignalStatus = p === 0 ? 'good' : p <= 18 ? 'warn' : 'bad';
    signals.push(sig('Emission dependence', pct === 0 ? '0% — fully organic yield' : `${pct}% reward-driven`, status));
  } else if (apyReward == null && apy > 0) {
    inputs++;
    signals.push(sig('Emission dependence', '0% — fully organic yield', 'good'));
  }

  // Signal 2: Base APY (informational only)
  signals.push(sig('Base APY', apyBase > 0 ? `${apyBase.toFixed(2)}%` : '—', 'na'));

  // Signal 3: APY forecast
  const { predictedClass, predictedProbability, binnedConfidence } = pool.predictions ?? {};
  if (predictedClass) {
    inputs++;
    const prob = predictedProbability == null ? null : (predictedProbability < 1 ? predictedProbability * 100 : predictedProbability);
    const classMap: Record<string, number> = {
      'Up': 0, 'Stable/Up': 3, 'Stable': 8, 'Stable/Down': 20, 'Down': 35,
    };
    let p = classMap[predictedClass] ?? 10;
    if (prob != null && prob < 60) p = Math.round(p * 0.7);
    penalty += p;
    const probStr = prob != null ? ` (${Math.round(prob)}% conf)` : '';
    const status: SignalStatus = p === 0 ? 'good' : p <= 8 ? 'warn' : 'bad';
    signals.push(sig('APY forecast', `${predictedClass}${probStr}`, status));
  } else {
    signals.push(sig('APY forecast', 'no model signal', 'na'));
  }

  const insufficientData = inputs === 0;
  const score = clamp(100 - penalty, 0, 100);
  const verdict =
    score >= 70
      ? 'Yield is largely organic and projected stable.'
      : score >= 45
      ? 'Yield leans on emissions or a softening forecast.'
      : 'Yield is emission-heavy and/or projected to decline.';

  return { key: 'yield_sustainability', label: 'Yield Sustainability', weight: 18, score, insufficientData, verdict, signals };
}

// ── Pillar 2: Return Stability ────────────────────────────────────────────────
function scoreReturnStability(pool: PoolData, cm: ChartMetrics | null): PillarResult {
  const signals: Signal[] = [];
  let penalty = 0;
  let inputs = 0;

  const apy = num(pool.apy);
  const sigma = num(pool.sigma);
  const mu = num(pool.mu);
  const apyMean30d = pool.apyMean30d ?? null;

  // Signal 1: Risk-adjusted yield (μ/σ)
  if (sigma > 0) {
    inputs++;
    const ratio = (mu > 0 ? mu : apy) / sigma;
    let p = 0;
    if (ratio >= 3) p = 0;
    else if (ratio >= 2) p = 5;
    else if (ratio >= 1) p = 12;
    else if (ratio >= 0.5) p = 22;
    else p = 35;
    penalty += p;
    const status: SignalStatus = p === 0 ? 'good' : p <= 12 ? 'warn' : 'bad';
    signals.push(sig('Risk-adjusted yield (μ/σ)', `${ratio.toFixed(2)} (σ=${sigma.toFixed(2)})`, status));
  } else {
    signals.push(sig('Risk-adjusted yield (μ/σ)', '—', 'na'));
  }

  // Signal 2: Current vs 30d mean
  if (apyMean30d != null && apyMean30d > 0) {
    inputs++;
    const mean = Math.max(apyMean30d, 0.01);
    const dev = Math.abs(apy - mean) / mean;
    let p = 0;
    if (dev <= 0.3) p = 0;
    else if (dev <= 0.6) p = 8;
    else if (dev <= 1.0) p = 16;
    else p = 28;
    penalty += p;
    const status: SignalStatus = p === 0 ? 'good' : p <= 8 ? 'warn' : 'bad';
    const deviation = ((apy - apyMean30d) / apyMean30d * 100).toFixed(0);
    const sign = Number(deviation) >= 0 ? '+' : '';
    signals.push(sig('Current vs 30d mean', `${sign}${deviation}% (mean ${apyMean30d.toFixed(2)}%)`, status));
  } else {
    signals.push(sig('Current vs 30d mean', '—', 'na'));
  }

  // Signal 3: APY trend (30d drives penalty, 1d/7d display)
  const apyPct30D = pool.apyPct30D ?? null;
  const apyPct1D = pool.apyPct1D ?? null;
  const apyPct7D = pool.apyPct7D ?? null;
  if (apyPct30D != null) {
    inputs++;
    let p = 0;
    if (apyPct30D >= -10) p = 0;
    else if (apyPct30D >= -30) p = 6;
    else if (apyPct30D >= -50) p = 14;
    else p = 24;
    penalty += p;
    const status: SignalStatus = p === 0 ? 'good' : p <= 6 ? 'warn' : 'bad';
    const d1 = apyPct1D != null ? `${apyPct1D >= 0 ? '+' : ''}${apyPct1D.toFixed(0)}%` : '—';
    const d7 = apyPct7D != null ? `${apyPct7D >= 0 ? '+' : ''}${apyPct7D.toFixed(0)}%` : '—';
    const d30 = `${apyPct30D >= 0 ? '+' : ''}${apyPct30D.toFixed(0)}%`;
    signals.push(sig('APY trend (1d/7d/30d)', `${d1} / ${d7} / ${d30}`, status));
  } else {
    signals.push(sig('APY trend (1d/7d/30d)', '—', 'na'));
  }

  // Signal 4: APY drawdown (90d)
  if (cm?.apyDrawdown != null) {
    inputs++;
    const dd = cm.apyDrawdown;
    let p = 0;
    if (dd < 0.3) p = 0;
    else if (dd < 0.5) p = 6;
    else if (dd < 0.75) p = 12;
    else p = 18;
    penalty += p;
    const status: SignalStatus = p === 0 ? 'good' : p <= 6 ? 'warn' : 'bad';
    signals.push(sig('APY drawdown (90d)', `${Math.round(dd * 100)}% peak-to-trough`, status));
  } else {
    signals.push(sig('APY drawdown (90d)', '—', 'na'));
  }

  const insufficientData = inputs === 0;
  const score = clamp(100 - penalty, 0, 100);
  const verdict =
    score >= 70
      ? 'Returns are stable with strong risk-adjusted yield.'
      : score >= 45
      ? 'Moderate yield volatility or recent trend weakness.'
      : 'High yield volatility or significant drawdown detected.';

  return { key: 'return_stability', label: 'Return Stability', weight: 18, score, insufficientData, verdict, signals };
}

// ── Pillar 3: Liquidity & Market Depth ───────────────────────────────────────
function scoreLiquidityDepth(pool: PoolData): PillarResult {
  const signals: Signal[] = [];
  let penalty = 0;
  let inputs = 0;

  const tvl = num(pool.tvlUsd);
  const vol1d = pool.volumeUsd1d ?? null;
  const vol7d = pool.volumeUsd7d ?? null;

  // Signal 1: Pool TVL
  inputs++;
  let p = 0;
  if (tvl >= 1e9) p = 0;
  else if (tvl >= 1e8) p = 6;
  else if (tvl >= 1e7) p = 16;
  else if (tvl >= 1e6) p = 30;
  else if (tvl >= 1e5) p = 45;
  else p = 60;
  penalty += p;
  const tvlStatus: SignalStatus = p === 0 ? 'good' : p <= 16 ? 'warn' : 'bad';
  const tvlStr = tvl >= 1e9 ? `$${(tvl / 1e9).toFixed(1)}b` : tvl >= 1e6 ? `$${(tvl / 1e6).toFixed(1)}m` : `$${(tvl / 1e3).toFixed(0)}k`;
  signals.push(sig('Pool TVL (exit depth)', tvlStr, tvlStatus));

  // Signal 2: Daily turnover
  if (vol1d != null && tvl > 0) {
    inputs++;
    const t = vol1d / tvl;
    let tp = 0;
    if (t >= 0.05 && t <= 3) tp = 0;
    else if ((t >= 0.01 && t < 0.05) || t > 3) tp = 8;
    else tp = 18;
    penalty += tp;
    const volStatus: SignalStatus = tp === 0 ? 'good' : 'warn';
    const vol7dStr = vol7d != null ? ` (7d avg $${(vol7d / 7e6).toFixed(1)}m/d)` : '';
    signals.push(sig('Swap volume', `$${(vol1d / 1e6).toFixed(1)}m/d${vol7dStr}`, volStatus));
  } else {
    signals.push(sig('Swap volume', 'n/a — depth scored on TVL only', 'na'));
  }

  const insufficientData = inputs === 0;
  const score = clamp(100 - penalty, 0, 100);
  const verdict =
    score >= 70
      ? 'Deep liquidity supports sizing in and out.'
      : score >= 45
      ? 'Moderate liquidity; large positions may face slippage.'
      : 'Thin liquidity; exit risk is elevated.';

  return { key: 'liquidity_depth', label: 'Liquidity & Market Depth', weight: 20, score, insufficientData, verdict, signals };
}

// ── Pillar 4: Impermanent Loss & Composition ─────────────────────────────────
function scoreILComposition(pool: PoolData): PillarResult {
  const signals: Signal[] = [];
  let penalty = 0;

  const ilRisk = pool.ilRisk ?? '';
  const exposure = pool.exposure ?? '';
  const tokens = (pool.underlyingTokens ?? []).map(t => t.toUpperCase());
  const stablecoin = pool.stablecoin ?? false;
  const il7d = pool.il7d ?? null;

  // Signal 1: Structural IL (always counts as input)
  let structP = 0;
  let structStatus: SignalStatus = 'good';
  let structValue = '';

  if (ilRisk === 'no' || exposure === 'single') {
    structP = 0;
    structStatus = 'good';
    structValue = 'single-asset — no IL';
  } else if (exposure === 'multi') {
    const allStable = tokens.length > 0 && tokens.every(t => STABLECOIN_SYMBOLS.has(t));
    const allVol = tokens.length > 0 && tokens.every(t => !STABLECOIN_SYMBOLS.has(t));
    if (allStable) { structP = 8; structStatus = 'good'; structValue = 'stable-stable pair'; }
    else if (allVol) { structP = 40; structStatus = 'bad'; structValue = 'volatile-volatile pair'; }
    else { structP = 22; structStatus = 'warn'; structValue = 'mixed stable/volatile pair'; }
  } else {
    structP = 15;
    structStatus = 'warn';
    structValue = 'exposure unclear';
  }
  penalty += structP;
  signals.push(sig('Structural IL', structValue, structStatus));

  // Signal 2: Realized IL (7d)
  if (il7d != null) {
    const mag = Math.abs(il7d);
    let p = 0;
    if (mag < 0.01) p = 0;
    else if (mag < 0.03) p = 6;
    else if (mag < 0.08) p = 14;
    else p = 24;
    penalty += p;
    const ilStatus: SignalStatus = p === 0 ? 'good' : p <= 6 ? 'warn' : 'bad';
    signals.push(sig('Realized IL (7d)', `${(il7d * 100).toFixed(2)}%`, ilStatus));
  } else {
    signals.push(sig('Realized IL (7d)', '—', 'na'));
  }

  // Signal 3: Depeg exposure (informational)
  if (stablecoin && tokens.length > 0) {
    signals.push(sig('Depeg exposure', tokens.join(', '), 'na'));
  } else {
    signals.push(sig('Depeg exposure', stablecoin ? 'stablecoin pool' : 'no', 'na'));
  }

  const score = clamp(100 - penalty, 0, 100);
  const verdict =
    score >= 70
      ? 'Minimal divergence risk in the asset structure.'
      : score >= 45
      ? 'Moderate IL risk — monitor asset divergence.'
      : 'Significant IL exposure detected.';

  return { key: 'il_composition', label: 'Impermanent Loss & Composition', weight: 16, score, insufficientData: false, verdict, signals };
}

// ── Pillar 5: Track Record & Data Confidence ─────────────────────────────────
function scoreTrackRecord(pool: PoolData, cm: ChartMetrics | null): PillarResult {
  const signals: Signal[] = [];
  let penalty = 0;
  let inputs = 0;

  const count = num(pool.count);
  const spanDays = cm?.spanDays ?? 0;
  const days = Math.max(count, spanDays);

  // Signal 1: Track record
  if (days > 0 || count > 0) {
    inputs++;
    let p = 0;
    if (days >= 365) p = 0;
    else if (days >= 180) p = 6;
    else if (days >= 90) p = 14;
    else if (days >= 30) p = 26;
    else p = 40;
    penalty += p;
    const status: SignalStatus = p === 0 ? 'good' : p <= 14 ? 'warn' : 'bad';
    const label = days >= 365 ? `${(days / 365).toFixed(1)}y of history` : `${days}d of history`;
    signals.push(sig('Track record', label, status));
  } else {
    signals.push(sig('Track record', '—', 'na'));
  }

  // Signal 2: Forecast confidence
  const binnedConfidence = pool.predictions?.binnedConfidence;
  if (binnedConfidence != null) {
    inputs++;
    const conf = num(binnedConfidence);
    let p = 0;
    let label = 'low';
    if (conf >= 3) { p = 0; label = 'high'; }
    else if (conf >= 2) { p = 8; label = 'medium'; }
    else { p = 18; label = 'low'; }
    penalty += p;
    const status: SignalStatus = p === 0 ? 'good' : p <= 8 ? 'warn' : 'bad';
    signals.push(sig('Forecast confidence', label, status));
  } else {
    signals.push(sig('Forecast confidence', '—', 'na'));
  }

  // Signal 3: Outlier flag
  if (pool.outlier === true) {
    inputs++;
    penalty += 12;
    signals.push(sig('Outlier flag', 'flagged', 'bad'));
  } else if (pool.outlier === false) {
    signals.push(sig('Outlier flag', 'none', 'good'));
  } else {
    signals.push(sig('Outlier flag', '—', 'na'));
  }

  const insufficientData = inputs === 0;
  const score = clamp(100 - penalty, 0, 100);
  const verdict =
    score >= 70
      ? 'Long, clean track record — stats are trustworthy.'
      : score >= 45
      ? 'Limited history or moderate data concerns.'
      : 'Short history or data quality flags present.';

  return { key: 'track_record', label: 'Track Record & Data Confidence', weight: 14, score, insufficientData, verdict, signals };
}

function parseAuditInfo(meta: ProtocolMeta): { auditCount: number; ageDays: number } {
  const auditCount =
    (meta.audits != null && parseInt(meta.audits, 10) > 0)
      ? parseInt(meta.audits, 10)
      : (meta.auditLinks?.length ?? 0) > 0
      ? 1
      : 0;
  const ageDays = meta.listedAt != null ? (Date.now() / 1000 - meta.listedAt) / 86400 : 0;
  return { auditCount, ageDays };
}

// ── Pillar 6: Protocol Counterparty ──────────────────────────────────────────
function scoreProtocolCounterparty(meta: ProtocolMeta | null): PillarResult {
  if (!meta) {
    return {
      key: 'protocol_counterparty',
      label: 'Protocol Counterparty',
      weight: 14,
      score: 50,
      insufficientData: true,
      verdict: 'No protocol metadata available.',
      signals: [sig('Audits', '—', 'na'), sig('Protocol age', '—', 'na'), sig('Protocol TVL', '—', 'na')],
    };
  }

  const signals: Signal[] = [];
  let penalty = 0;

  const { auditCount, ageDays } = parseAuditInfo(meta);

  // Signal 1: Audits
  let ap = 0;
  if (auditCount >= 2) ap = 0;
  else if (auditCount === 1) ap = 10;
  else ap = 28;
  penalty += ap;
  const auditStatus: SignalStatus = ap === 0 ? 'good' : ap <= 10 ? 'warn' : 'bad';
  signals.push(sig('Audits', auditCount > 0 ? `${auditCount} on file` : 'none found', auditStatus));

  // Signal 2: Protocol age
  let agep = 0;
  if (ageDays >= 730) agep = 0;
  else if (ageDays >= 365) agep = 6;
  else if (ageDays >= 180) agep = 16;
  else if (ageDays >= 90) agep = 26;
  else agep = 40;
  penalty += agep;
  const ageStatus: SignalStatus = agep === 0 ? 'good' : agep <= 16 ? 'warn' : 'bad';
  const ageLabel =
    ageDays >= 730
      ? `${(ageDays / 365).toFixed(1)}y old`
      : ageDays >= 30
      ? `${Math.round(ageDays / 30)}mo old`
      : `${Math.round(ageDays)}d old`;
  signals.push(sig('Protocol age', ageLabel, ageStatus));

  // Signal 3: Protocol TVL
  const tvl = meta.tvl ?? null;
  const mcap = meta.mcap ?? null;
  let tp = 0;
  if (tvl == null) tp = 24;
  else if (tvl >= 1e9) tp = 0;
  else if (tvl >= 1e8) tp = 6;
  else if (tvl >= 1e7) tp = 14;
  else tp = 24;
  penalty += tp;
  const tvlStatus: SignalStatus = tp === 0 ? 'good' : tp <= 6 ? 'warn' : 'bad';
  const tvlStr = tvl != null ? (tvl >= 1e9 ? `$${(tvl / 1e9).toFixed(1)}b` : `$${(tvl / 1e6).toFixed(0)}m`) : '—';
  const mcapStr = mcap != null ? ` · mcap $${mcap >= 1e9 ? (mcap / 1e9).toFixed(1) + 'b' : (mcap / 1e6).toFixed(0) + 'm'}` : '';
  signals.push(sig('Protocol TVL', `${tvlStr}${mcapStr}`, tvlStatus));

  const score = clamp(100 - penalty, 0, 100);
  const verdict =
    score >= 70
      ? 'Audited, established venue with deep protocol TVL.'
      : score >= 45
      ? 'Moderate protocol maturity or limited audit history.'
      : 'Unaudited or nascent protocol — elevated counterparty risk.';

  return { key: 'protocol_counterparty', label: 'Protocol Counterparty', weight: 14, score, insufficientData: false, verdict, signals };
}

// ── Flags ─────────────────────────────────────────────────────────────────────
function evaluateFlags(
  pool: PoolData,
  cm: ChartMetrics | null,
  auditCount: number,
  ageDays: number,
): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const apy = num(pool.apy);
  const apyMean30d = num(pool.apyMean30d);
  const apyReward = pool.apyReward != null ? num(pool.apyReward) : null;
  const tvl = num(pool.tvlUsd);
  const vol1d = pool.volumeUsd1d ?? null;

  const add = (id: string, severity: FlagSeverity, message: string) => flags.push({ id, severity, message });

  // Critical
  if (apyMean30d > 0 && apy > apyMean30d * 1.5) add('apy_spike', 'critical', 'APY is 1.5× above 30-day mean — potential manipulation or unsustainable spike.');
  if (apyMean30d > 0 && apy < apyMean30d * 0.5) add('apy_collapse', 'critical', 'APY has collapsed to less than half its 30-day mean.');
  if (apyReward != null && apy > 25 && apyReward / apy > 0.8) add('emissions_driven', 'critical', 'High APY is >80% reward-driven — yield is highly emission-dependent.');

  // Warning
  if (cm?.tvlDrawdown != null && cm.tvlDrawdown > 0.5) add('tvl_drawdown', 'warning', `TVL drawdown of ${Math.round(cm.tvlDrawdown * 100)}% detected in the last 90 days.`);
  if (pool.il7d != null && Math.abs(pool.il7d) > 0.05) add('high_il', 'warning', `Realized 7-day IL of ${(Math.abs(pool.il7d) * 100).toFixed(2)}% is elevated.`);
  if (vol1d != null && tvl > 0 && vol1d / tvl < 0.01) add('dead_volume', 'warning', 'Daily volume is less than 1% of TVL — low liquidity utilisation.');
  if ((pool.apyPct30D ?? 0) < -50) add('apy_decay', 'warning', 'APY has dropped more than 50% over the past 30 days.');
  if (auditCount === 0 && ageDays < 180) add('young_unaudited', 'warning', 'Protocol is under 6 months old and has no audits on record.');
  if (pool.outlier === true) add('outlier', 'warning', 'DeFiLlama has flagged this pool as a statistical outlier.');
  if (tvl < 1e6) add('micro_tvl', 'warning', 'Pool TVL is below $1M — exit liquidity is very limited.');

  // Info
  if ((pool.predictions?.binnedConfidence ?? 0) <= 1) add('low_confidence', 'info', 'APY forecast confidence is low — prediction reliability is limited.');
  if (pool.stablecoin) add('depeg', 'info', 'Pool is stablecoin-based — monitor for depeg events.');

  const order: Record<FlagSeverity, number> = { critical: 0, warning: 1, info: 2 };
  return flags.sort((a, b) => order[a.severity] - order[b.severity]);
}

// ── Main entry point ──────────────────────────────────────────────────────────
export function scorePool(
  pool: PoolData,
  meta: ProtocolMeta | null,
  chartPoints: PoolChartPoint[],
): RiskScoringResult {
  const cm = computeChartMetrics(chartPoints);

  const pillars: PillarResult[] = [
    scoreYieldSustainability(pool),
    scoreReturnStability(pool, cm),
    scoreLiquidityDepth(pool),
    scoreILComposition(pool),
    scoreTrackRecord(pool, cm),
    scoreProtocolCounterparty(meta),
  ];

  const scored = pillars.filter(p => !p.insufficientData);
  const totalWeight = scored.reduce((s, p) => s + PILLAR_WEIGHTS[p.key], 0);
  const composite =
    totalWeight > 0
      ? Math.round(scored.reduce((s, p) => s + p.score * PILLAR_WEIGHTS[p.key], 0) / totalWeight)
      : 50;

  const compositeOutOf10 = Math.round(composite) / 10;
  const band = bandFor(composite);

  const coveredWeight = scored.reduce((s, p) => s + PILLAR_WEIGHTS[p.key], 0);
  let coverage = coveredWeight;
  if (!cm) coverage *= 0.9;
  const dataCoveragePct = Math.round(clamp(coverage, 0, 100));

  const { auditCount, ageDays } = meta != null ? parseAuditInfo(meta) : { auditCount: 0, ageDays: 0 };

  const flags = evaluateFlags(pool, cm, auditCount, ageDays);

  return { composite, compositeOutOf10, band, dataCoveragePct, pillars, flags };
}
