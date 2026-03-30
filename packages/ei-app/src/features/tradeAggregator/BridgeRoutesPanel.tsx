import React, { useState } from "react";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";
import { BridgeRouteCard } from "./BridgeRouteCard";

export const BridgeRoutesPanel = ({
  routes,
  chains,
  loading,
  error,
  lastUpdated,
}: any) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [expandedIdx, setExpandedIdx] = useState(0);
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
  if (!routes) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">⇄ No routes yet</Typography>
        <Typography color="text.secondary">
          Configure your bridge parameters and click Get Routes to see available options.
        </Typography>
      </Box>
    );
  }
  if (routes.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">⚠ No routes available</Typography>
        <Typography color="text.secondary">
          No bridge routes were found for this token pair and amount. Try a different token, chain, or amount.
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
