import React, { FC } from 'react';
import { Box, LinearProgress, Stack, Typography, useTheme } from '@mui/material';
import CheckCircle2Icon from '@mui/icons-material/CheckCircle';
import AlertTriangleIcon from '@mui/icons-material/Warning';
import XCircleIcon from '@mui/icons-material/Cancel';
import MinusCircleIcon from '@mui/icons-material/RemoveCircle';
import { PillarResult, SignalStatus } from './types';

const STATUS_COLOR: Record<SignalStatus, string> = {
  good: '#10B981',
  warn: '#F59E0B',
  bad: '#EF4444',
  na: '#94A3B8',
};

const StatusIcon: FC<{ status: SignalStatus }> = ({ status }) => {
  const sx = { fontSize: 14, color: STATUS_COLOR[status] };
  switch (status) {
    case 'good': return <CheckCircle2Icon sx={sx} />;
    case 'warn': return <AlertTriangleIcon sx={sx} />;
    case 'bad': return <XCircleIcon sx={sx} />;
    default: return <MinusCircleIcon sx={sx} />;
  }
};

function scoreColor(score: number): string {
  if (score >= 70) return '#10B981';
  if (score >= 45) return '#F59E0B';
  return '#EF4444';
}

interface Props {
  pillar: PillarResult;
}

export const PillarCard: FC<Props> = ({ pillar }) => {
  const theme = useTheme();
  const color = scoreColor(pillar.score);
  const labelColor = theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, color: labelColor }}>
            {pillar.label}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              background: 'rgba(148,163,184,0.12)',
              borderRadius: 1,
              px: 0.75,
              py: 0.25,
              opacity: 0.7,
              fontSize: '0.65rem',
            }}
          >
            {pillar.weight}% WEIGHT
          </Typography>
        </Stack>
        <Typography variant="body2" fontWeight={700} sx={{ color }}>
          {pillar.insufficientData ? '—' : `${pillar.score}/100`}
        </Typography>
      </Stack>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={pillar.insufficientData ? 0 : pillar.score}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: 'rgba(148,163,184,0.15)',
          '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 },
        }}
      />

      {/* Verdict */}
      <Typography variant="caption" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
        {pillar.verdict}
      </Typography>

      {/* Signals */}
      <Stack gap={0.75}>
        {pillar.signals.map((s) => (
          <Stack key={s.label} direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Stack direction="row" alignItems="center" gap={0.75}>
              <StatusIcon status={s.status} />
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {s.label}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              align="right"
              sx={{ color: STATUS_COLOR[s.status], fontWeight: s.status !== 'na' ? 500 : 400, opacity: s.status === 'na' ? 0.5 : 1 }}
            >
              {s.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
