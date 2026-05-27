import React, { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AlertCircleIcon from '@mui/icons-material/Error';
import AlertTriangleIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { FlagSeverity, RiskFlag } from './types';

const SEVERITY_COLOR: Record<FlagSeverity, string> = {
  critical: '#EF4444',
  warning: '#F59E0B',
  info: '#4FAADC',
};

const FlagIcon: FC<{ severity: FlagSeverity }> = ({ severity }) => {
  const sx = { fontSize: 16, color: SEVERITY_COLOR[severity], flexShrink: 0 };
  switch (severity) {
    case 'critical': return <AlertCircleIcon sx={sx} />;
    case 'warning': return <AlertTriangleIcon sx={sx} />;
    default: return <InfoIcon sx={sx} />;
  }
};

interface Props {
  flags: RiskFlag[];
}

export const RiskFlagsCard: FC<Props> = ({ flags }) => (
  <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 2,
        py: 1.25,
        bgcolor: '#10B981',
        borderBottom: flags.length > 0 ? '1px solid rgba(0,0,0,0.15)' : 'none',
      }}
    >
      <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, color: '#fff' }}>
        Risk Flags &amp; Exit Triggers
      </Typography>
      <Typography
        variant="caption"
        sx={{
          background: 'rgba(255,255,255,0.25)',
          color: '#fff',
          borderRadius: 1,
          px: 0.75,
          py: 0.25,
          fontWeight: 700,
        }}
      >
        {flags.length}
      </Typography>
    </Stack>

    <Box sx={{ px: 2, py: 1.5 }}>
      {flags.length === 0 ? (
        <Typography variant="caption" sx={{ color: '#10B981' }}>
          No active risk flags detected for this pool.
        </Typography>
      ) : (
        <Stack gap={1}>
          {flags.map((f) => (
            <Stack key={f.id} direction="row" alignItems="flex-start" gap={1}>
              <FlagIcon severity={f.severity} />
              <Typography variant="caption" sx={{ lineHeight: 1.5 }}>
                {f.message}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  </Box>
);
