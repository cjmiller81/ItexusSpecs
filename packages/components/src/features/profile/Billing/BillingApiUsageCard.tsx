import { useEffect, useState } from "react";
import { Box, Typography, LinearProgress, useTheme, Grid, Paper } from "@mui/material";
import { appAxios } from "../../../lib/axios/customAxios";

interface ApiUsageStatus {
  userId: string;
  startDate: string;
  endDate: string;
  totalRequests: number;
  allowedRequests: number;
}

export function BillingApiUsageCard() {
  const theme = useTheme();
  const [usage, setUsage] = useState<ApiUsageStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    appAxios.get('/api/request-tracking/status')
      .then(res => {
        if (mounted) {
          setUsage(res.data);
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
  }, []);

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const percentageUsed = usage && usage.allowedRequests > 0 ? (usage.totalRequests / usage.allowedRequests) * 100 : 0;
  const remainingCalls = usage ? usage.allowedRequests - usage.totalRequests : 0;
  const averageDailyUse = usage && usage.startDate && usage.endDate ?
    Math.round(usage.totalRequests / ((new Date(usage.endDate).getTime() - new Date(usage.startDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;

  const bgColor = theme.palette.mode === 'dark' ? '#23242a' : '#e5ddd5ff';
  const cardColor = theme.palette.mode === 'dark' ? '#2B2D36' : '#f0ece5ff';
  const labelColor = theme.palette.mode === 'dark' ? '#B0B3C0' : 'rgba(0, 0, 0, 0.6)';
  const valueColor = theme.palette.mode === 'dark' ? '#3CB371' : '#3CB371';
  const captionColor = theme.palette.mode === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.87)';

  return (
    <Box width="100%" mb={3}>
      <Paper elevation={4} sx={{ bgcolor: cardColor, borderRadius: 3, p: 3, width: '75%', maxWidth: 1200 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: captionColor }}>API Usage This Month</Typography>
            <Typography variant="body2" sx={{ color: labelColor, mt: 0.5 }}>
              Billing period: {usage ? formatPeriod(usage.startDate, usage.endDate) : '--'}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h3" sx={{ fontWeight: 700, color: captionColor }}>
              {loading ? '...' : error ? '--' : usage?.totalRequests ?? 0}
            </Typography>
            <Typography variant="body2" sx={{ color: labelColor }}>
              of {usage?.allowedRequests ?? 0} calls
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2, mb: 2 }}>
          <LinearProgress variant="determinate" value={percentageUsed} sx={{ height: 8, borderRadius: 2, bgcolor: bgColor, '& .MuiLinearProgress-bar': { bgcolor: valueColor } }} />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ bgcolor: bgColor, borderRadius: 2, p: 2 }}>
              <Typography variant="caption" sx={{ color: labelColor, fontWeight: 500 }}>PERCENTAGE USED</Typography>
              <Typography variant="h5" sx={{ color: valueColor, fontWeight: 700, mt: 1 }}>
                {loading ? '...' : error ? '--' : `${percentageUsed.toFixed(1)}%`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ bgcolor: bgColor, borderRadius: 2, p: 2 }}>
              <Typography variant="caption" sx={{ color: labelColor, fontWeight: 500 }}>REMAINING CALLS</Typography>
              <Typography variant="h5" sx={{ color: captionColor, fontWeight: 700, mt: 1 }}>
                {loading ? '...' : error ? '--' : remainingCalls}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ bgcolor: bgColor, borderRadius: 2, p: 2 }}>
              <Typography variant="caption" sx={{ color: labelColor, fontWeight: 500 }}>AVERAGE DAILY USE</Typography>
              <Typography variant="h5" sx={{ color: captionColor, fontWeight: 700, mt: 1 }}>
                {loading ? '...' : error ? '--' : averageDailyUse}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
