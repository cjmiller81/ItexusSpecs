import React, { useState } from "react";
import { Box, Typography, Chip, Button, Collapse, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const hardcodedRoutes = [
  {
    provider: 'CCTP + Mayan',
    best: true,
    fastest: false,
    amount: '4,061.2858 USDC',
    gas: '$0.06',
    time: '15m',
    impact: '+0.03%',
    impactColor: '#00e5a0',
    rate: '1 DAI ≈ 0.999968 USDC',
    steps: [
      {
        type: 'swap',
        label: 'Swap on Ethereum via OKX Dex Aggregator',
        tokens: ['4,061.4122 DAI', '4,061.3593 USDC'],
        meta: ['⛽ Est. gas: $0.00', { link: 'https://app.1inch.io', label: 'app.1inch.io ↗' }, '· Re-enter amounts on site'],
      },
      {
        type: 'bridge',
        label: 'Bridge from Ethereum to Arbitrum via CCTP + Mayan',
        tokens: ['4,061.3593 USDC on Ethereum', '4,061.2858 USDC on Arbitrum'],
        meta: ['⛽ Est. gas: $0.06', { link: 'https://mayan.finance', label: 'mayan.finance ↗' }, '· Re-enter amounts on site'],
      },
    ],
    summary: 'Complete steps in order — each step requires a separate wallet signature. Amounts shown are estimates; re-enter them manually on each protocol\'s site.'
  },
  {
    provider: 'CCTPv2 + Mayan',
    best: false,
    fastest: false,
    amount: '4,060.8631 USDC',
    gas: '$0.06',
    time: '35s',
    impact: '+0.02%',
    impactColor: '#00e5a0',
    rate: '1 DAI ≈ 0.999864 USDC',
    steps: [
      {
        type: 'bridge',
        label: 'Bridge from Ethereum to Arbitrum via CCTPv2',
        tokens: ['4,061.4122 DAI on Ethereum', 'USDC on Arbitrum'],
        meta: ['⛽ Est. gas: $0.03', { link: 'https://bridge.circle.com', label: 'bridge.circle.com ↗' }, '· Re-enter amounts on site'],
      },
      {
        type: 'swap',
        label: 'Swap on Arbitrum via Mayan',
        tokens: ['USDC', '4,060.8631 USDC'],
        meta: ['⛽ Est. gas: $0.03', { link: 'https://mayan.finance', label: 'mayan.finance ↗' }, '· Re-enter amounts on site'],
      },
    ],
    summary: 'Complete steps in order — each step requires a separate wallet signature. Amounts shown are estimates; re-enter them manually on each protocol\'s site.'
  },
  {
    provider: 'Mayan (Swift)',
    best: false,
    fastest: true,
    amount: '4,059.7095 USDC',
    gas: '$0.06',
    time: '10s',
    impact: '-0.01%',
    impactColor: '#7680a0',
    rate: '1 DAI ≈ 0.99958 USDC',
    steps: [
      {
        type: 'bridge',
        label: 'Bridge from Ethereum to Arbitrum via Mayan Swift',
        tokens: ['4,061.4122 DAI on Ethereum', '4,059.7095 USDC on Arbitrum'],
        meta: ['⛽ Est. gas: $0.06', { link: 'https://mayan.finance', label: 'mayan.finance ↗' }, '· Re-enter amounts on site'],
      },
    ],
    summary: 'Single-step route — requires one wallet signature. Amounts shown are estimates; re-enter them manually on the protocol\'s site.'
  },
  {
    provider: 'Stargate',
    best: false,
    fastest: false,
    amount: '4,056.5141 USDC',
    gas: '$0.11',
    time: '2m',
    impact: '-0.09%',
    impactColor: '#f5a623',
    rate: '1 DAI ≈ 0.9991 USDC',
    steps: [
      {
        type: 'bridge',
        label: 'Bridge from Ethereum to Arbitrum via Stargate',
        tokens: ['4,061.4122 DAI on Ethereum', '4,056.5141 USDC on Arbitrum'],
        meta: ['⛽ Est. gas: $0.11', { link: 'https://stargate.finance/bridge', label: 'stargate.finance ↗' }, '· Re-enter amounts on site'],
      },
    ],
    summary: 'Single-step route — requires one wallet signature. Amounts shown are estimates; re-enter them manually on the protocol\'s site.'
  },
];

export function BridgeRoutesMockup() {
  const [openIdx, setOpenIdx] = useState(-1);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const theme = useTheme();
  return (
    <Box>
      {hardcodedRoutes.map((route, idx) => (
        <Box key={idx} sx={{ border: '1px solid #30364a', borderRadius: '10px', background: selectedIdx === idx ? 'rgba(0,229,160,0.01)' : (theme.palette.mode === 'dark' ? 'rgb(37,40,54)' : '#fff'), mb: 1.5, cursor: 'pointer', overflow: 'hidden', borderColor: selectedIdx === idx ? 'rgba(0,229,160,0.28)' : '#30364a' }} onClick={() => setSelectedIdx(idx)}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', p: 2 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid', borderColor: selectedIdx === idx ? '#00e5a0' : '#30364a', background: selectedIdx === idx ? '#00e5a0' : 'transparent', mt: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedIdx === idx && <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#0d1117' }} />}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.83rem' }}>{route.provider}</Typography>
                  {route.best && <Chip label="⭐ BEST" size="small" sx={{ background: 'rgba(245,200,66,0.12)', color: '#f5c842', border: '1px solid rgba(245,200,66,0.4)', fontWeight: 700, fontSize: '0.63rem', height: 20, ml: 1 }} />}
                  {route.fastest && <Chip label="⚡ FASTEST" size="small" sx={{ background: 'rgba(91,140,245,0.12)', color: '#5b8cf5', border: '1px solid rgba(91,140,245,0.4)', fontWeight: 700, fontSize: '0.63rem', height: 20, ml: 1 }} />}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.12rem', color: selectedIdx === idx ? '#00e5a0' : '#23263a' }}>{route.amount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.72rem', color: '#7F8AA1', fontWeight: 700 }}>
                  <span style={{ fontWeight: 700, color: '#7F8AA1' }}>⛽ {route.gas}</span>
                  <span style={{ fontWeight: 700, color: '#7F8AA1' }}>🕐 {route.time}</span>
                  <span style={{ color: route.impactColor, fontWeight: 700 }}>{route.impact}</span>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#7F8AA1', mt: 1, fontWeight: 700 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.72rem', color: '#7F8AA1', fontWeight: 700 }}>
                  <span style={{ fontWeight: 700, color: '#7F8AA1' }}>≈ ${route.amount.replace(/[^\d.]/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
                  <span style={{ color: '#7F8AA1', fontWeight: 700, margin: '0 0px' }}>·</span>
                  <span style={{ fontWeight: 700, color: '#7F8AA1' }}>{route.rate}</span>
                </Box>
                <Button 
                  size="small"
                  endIcon={<ExpandMoreIcon sx={{ fontSize: '1rem', transform: openIdx === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
                  sx={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 600, 
                    color: openIdx === idx ? '#00e5a0' : '#7680a0', 
                    background: openIdx === idx ? 'rgba(0,229,160,0.10)' : selectedIdx === idx ? 'rgba(0,229,160,0.01)' : (theme.palette.mode === 'dark' ? 'rgb(37,40,54)' : '#fff'),  
                    border: '1px solid', 
                    borderColor: openIdx === idx ? 'rgba(0,229,160,0.28)' : selectedIdx === idx ? 'rgb(37,40,54)' : '#30364a', 
                    borderRadius: 1, 
                    px: 1.5, 
                    py: 0.5, 
                    minWidth: 0,
                    textTransform: 'none',
                  }} 
                  onClick={e => { e.stopPropagation(); setOpenIdx(openIdx === idx ? -1 : idx); }}
                >
                  {openIdx === idx ? 'Hide Steps' : 'View Steps'}
                </Button>
              </Box>
            </Box>
          </Box>
          <Collapse in={openIdx === idx} timeout="auto" unmountOnExit>
            <Box sx={{ borderTop: '1px solid #30364a', background: '#13151e', p: 2 }}>
              <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#7680a0', mb: 2 }}>How to execute this route</Typography>
              {route.steps.map((step, sidx) => (
                <Box key={sidx} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', position: 'relative', mb: 2 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: '#23263a', border: '1px solid #30364a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, color: step.type === 'swap' ? '#5b8cf5' : '#00e5a0', mt: 0.5 }}>{sidx + 1}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', px: 1, py: 0.5, borderRadius: 1, mb: 0.5, background: step.type === 'swap' ? 'rgba(91,140,245,0.12)' : 'rgba(0,229,160,0.10)', color: step.type === 'swap' ? '#5b8cf5' : '#00e5a0', border: '1px solid', borderColor: step.type === 'swap' ? 'rgba(91,140,245,0.3)' : 'rgba(0,229,160,0.28)' }}>{step.type === 'swap' ? '⇄ Swap' : '⇌ Bridge'}</Box>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#e4e8f5', mb: 0.5 }}>{step.label}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', color: '#7680a0', mb: 0.5 }}>
                      <Box sx={{ background: '#23263a', border: '1px solid #30364a', borderRadius: 1, px: 1, py: 0.5, fontWeight: 600 }}>{step.tokens[0]}</Box>
                      <span style={{ color: '#424b64', fontSize: '0.7rem' }}>→</span>
                      <Box sx={{ background: '#23263a', border: '1px solid #30364a', borderRadius: 1, px: 1, py: 0.5, fontWeight: 600 }}>{step.tokens[1]}</Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.68rem', color: '#424b64' }}>
                      {step.meta.map((m, mi) => typeof m === 'string' ? <span key={mi}>{m}</span> : <a key={mi} href={m.link} target="_blank" rel="noopener noreferrer" style={{ color: '#5b8cf5', textDecoration: 'none' }}>{m.label}</a>)}
                    </Box>
                  </Box>
                </Box>
              ))}
              <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #30364a', display: 'flex', alignItems: 'flex-start', gap: 1, fontSize: '0.72rem', color: '#7680a0', lineHeight: 1.45 }}>
                <span style={{ fontSize: '0.8rem' }}>ℹ</span>
                {route.summary}
              </Box>
            </Box>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
}
