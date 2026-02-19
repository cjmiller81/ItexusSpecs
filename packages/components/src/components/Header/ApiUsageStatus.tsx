import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, useTheme } from '@mui/material';
import { appAxios } from "../../lib/axios/customAxios";

export function ApiUsageStatus() {
  const theme = useTheme();
  const router = useRouter();
  const [usage, setUsage] = useState<{ totalRequests: number; allowedRequests: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    appAxios.get('/api/request-tracking/status')
      .then(res => {
        if (mounted) {
          setUsage({
            totalRequests: res.data.totalRequests,
            allowedRequests: res.data.allowedRequests,
          });
          setError(false);
        }
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [router.asPath]);

  const backgroundColor = theme.palette.mode === 'dark' ? '#2B2D36' : '#e1eef3ff';
  const captionColor = theme.palette.mode === 'dark' ? '#B0B3C0' : 'rgba(0, 0, 0, 0.6)';
  const valueColor = theme.palette.mode === 'dark' ? 'white' : '#1a2a3a';

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        bgcolor: backgroundColor,
        borderRadius: '18px',
        px: 2,
        py: 0.5,
        boxShadow: 2,
        minWidth: 120,
        height: 40,
        mr: 1,
        transition: 'background 0.2s',
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          bgcolor: '#3CB371',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 1,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" fill="#3CB371" />
          <path d="M5.5 8.5L7.5 10.5L11 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Typography variant="caption" sx={{ lineHeight: 1, fontSize: 10, fontWeight: 500, color: captionColor }}>
          API USAGE
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: valueColor }}>
          {loading ? '...' : error ? '--' : `${usage?.totalRequests ?? 0} / ${usage?.allowedRequests ?? 0} calls`}
        </Typography>
      </Box>
    </Box>
  );
}