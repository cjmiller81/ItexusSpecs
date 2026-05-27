export type SignalStatus = 'good' | 'warn' | 'bad' | 'na';
export type RiskBand = 'excellent' | 'strong' | 'moderate' | 'caution' | 'high_risk';
export type FlagSeverity = 'critical' | 'warning' | 'info';

export type Signal = {
  label: string;
  value: string;
  status: SignalStatus;
};

export type PillarResult = {
  key: string;
  label: string;
  weight: number;
  score: number;
  insufficientData: boolean;
  verdict: string;
  signals: Signal[];
};

export type RiskFlag = {
  id: string;
  severity: FlagSeverity;
  message: string;
};

export type ChartMetrics = {
  spanDays: number;
  tvlDrawdown: number | null;
  apyDrawdown: number | null;
};

export type RiskScoringResult = {
  composite: number;
  compositeOutOf10: number;
  band: RiskBand;
  dataCoveragePct: number;
  pillars: PillarResult[];
  flags: RiskFlag[];
};
