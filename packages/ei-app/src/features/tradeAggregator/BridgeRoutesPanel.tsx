import React, { useState } from "react";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";
import { BridgeRouteCard } from "./BridgeRouteCard";

export const BridgeRoutesPanel = ({
  routes,
  chains,
  loading,
  error,
  lastUpdated,
  hasRequested = false,
}: any) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [expandedIdx, setExpandedIdx] = useState(-1);
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Searching best bridge routes…</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">✕ Failed to fetch routes</Typography>
        <Typography color="text.secondary">{error}</Typography>
      </Box>
    );
  }
  if (!hasRequested) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 340,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="none" />
              <path d="M16 8v12M16 20l-4-4m4 4l4-4" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Box>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Routes will appear here
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1, mt: 2 }}>
          <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: theme.palette.text.secondary }}>
            <span style={{ fontWeight: 700, color: '#00e5a0' }}>①</span> Fill in Bridge From details
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: theme.palette.text.secondary }}>
            <span style={{ fontWeight: 700, color: '#00e5a0' }}>②</span> Fill in Bridge To details
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: theme.palette.text.secondary }}>
            <span style={{ fontWeight: 700, color: '#00e5a0' }}>③</span> Click &quot;Get Quotes&quot; button
          </Typography>
        </Box>
        <Typography color="text.secondary" sx={{ mt: 1, fontSize: '0.95rem' }}>
          Bridge route options will load here after all 3 steps have been completed
        </Typography>
      </Box>
    );
  }
  if (!routes || routes.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.8rem', mb: 1 }}>
          ⚠
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          No bridge routes were found this token pair and quantity
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
          Try a different quantity if liquidity is low or try when market volume is higher. It is possible liquidity may simply not be available for your selected pair and chain.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxHeight: '600px',
        overflowY: 'auto',
        pr: 1,
        // Modern custom scrollbar (like WalletsTable)
        scrollbarColor: `${theme.palette.grey[700]} ${theme.palette.background.paper}`,
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
          background: 'transparent',
        },
        '&::-webkit-scrollbar-track': {
          width: '8px',
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'dark'
            ? theme.palette.grey[800]
            : theme.palette.grey[400],
          borderRadius: '8px',
          minHeight: '24px',
          border: `2px solid ${theme.palette.background.paper}`,
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.mode === 'dark'
            ? theme.palette.grey[600]
            : theme.palette.grey[600],
        },
        '&::-webkit-scrollbar-corner': {
          background: 'transparent',
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Bridge Routes
        </Typography>
        {/* routes count badge */}
        {lastUpdated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.7rem', color: '#00e5a0', fontWeight: 600 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5a0', boxShadow: '0 0 6px #00e5a0' }} />
            <span>{routes.length} route{routes.length !== 1 ? "s" : ""} found</span>
          </Box>
        )}
      </Box>
      {routes.map((route: any, idx: number) => (
        <BridgeRouteCard
          key={route.id || idx}
          route={route}
          chains={chains}
          selected={selectedIdx === idx}
          expanded={expandedIdx === idx}
          onSelect={() => setSelectedIdx(idx)}
          onExpand={() => setExpandedIdx(expandedIdx === idx ? -1 : idx)}
          index={idx}
        />
      ))}
    </Box>
  );
};
