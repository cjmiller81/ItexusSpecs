import React from "react";
import { Box, Typography, Chip, Button, Collapse, useTheme } from "@mui/material";
import { fromRawAmount, getAdjustedToAmount, getAdjustedToAmountMin, getChainName } from "./bridgeRouteUtils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PROTOCOL_URLS = {
  relaydepository: "https://relay.link/bridge",
  mayan: "https://mayan.finance",
  squid: "https://app.squidrouter.com",
  okx: "https://www.okx.com/dex",
  stargate: "https://stargate.finance",
  across: "https://across.to",
  hop: "https://hop.exchange",
  cbridge: "https://cbridge.celer.network",
  hyphen: "https://hyphen.biconomy.io",
  connext: "https://bridge.connext.network",
  symbiosis: "https://app.symbiosis.finance",
  xy: "https://app.xy.finance",
  orbiter: "https://www.orbiter.finance",
};

function formatAmount(val: number, decimals = 4) {
  if (val >= 1000) {
    return val.toLocaleString(undefined, { maximumFractionDigits: decimals });
  }
  return val.toFixed(decimals).replace(/\.0+$/, "").replace(/(\.[0-9]*[1-9])0+$/, "$1");
}

export const BridgeRouteCard = ({
  route,
  chains,
  selected,
  onSelect,
  expanded,
  onExpand,
  index,
}: any) => {
  const theme = useTheme();
  const adjustedToAmount = getAdjustedToAmount(route);
  const adjustedToAmountMin = getAdjustedToAmountMin(route);
  const adjustedToAmountUSD = adjustedToAmount * (route.toToken?.priceUSD ?? 0);
  const fromAmountDecimal = fromRawAmount(route.fromAmount, route.fromToken?.decimals ?? 18);
  const impliedRate = fromAmountDecimal ? (adjustedToAmount / fromAmountDecimal).toFixed(6) : '0';
  const impact = (route.fromAmountUSD ? ((route.toAmountUSD - route.fromAmountUSD) / route.fromAmountUSD) * 100 : 0);
  const impactColor = impact >= 0 ? "#00e5a0" : impact < -0.05 ? "#f5a623" : "#7680a0";
  const duration = route.steps?.[0]?.estimate?.executionDuration ?? 0;
  const durationStr = duration < 60 ? `${Math.round(duration)}s` : `${Math.round(duration / 60)}m`;
  const displaySteps = route.steps?.[0]?.includedSteps?.filter((step: any) => step.tool !== "feeCollection") ?? [];

  return (
    <Box
      onClick={onSelect}
      sx={{
        border: '1px solid',
        borderRadius: '10px',
        background: selected ? 'rgba(0,229,160,0.01)' : (theme.palette.mode === 'dark' ? 'rgb(37,40,54)' : '#fff'),
        mb: 1.5,
        cursor: 'pointer',
        overflow: 'hidden',
        borderColor: selected ? 'rgba(0,229,160,0.28)' : '#30364a',
        transition: 'border 0.2s, background 0.2s',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', p: 2 }}>
        <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid', borderColor: selected ? '#00e5a0' : '#30364a', background: selected ? '#00e5a0' : 'transparent', mt: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selected && <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#0d1117' }} />}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.83rem' }}>{route.steps?.[0]?.toolDetails?.name || route.provider || ''}</Typography>
              {route.tags?.includes('RECOMMENDED') && <Chip label="⭐ BEST" size="small" sx={{ background: 'rgba(245,200,66,0.12)', color: '#f5c842', border: '1px solid rgba(245,200,66,0.4)', fontWeight: 700, fontSize: '0.63rem', height: 20, ml: 1 }} />}
              {route.tags?.includes('FASTEST') && <Chip label="⚡ FASTEST" size="small" sx={{ background: 'rgba(91,140,245,0.12)', color: '#5b8cf5', border: '1px solid rgba(91,140,245,0.4)', fontWeight: 700, fontSize: '0.63rem', height: 20, ml: 1 }} />}
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.12rem', color: selected ? '#00e5a0' : '#23263a' }}>{formatAmount(adjustedToAmount, 4)} {route.toToken?.symbol ?? ''}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.72rem', color: '#7F8AA1', fontWeight: 700 }}>
              <span style={{ fontWeight: 700, color: '#7F8AA1' }}>⛽ ${route.gasCostUSD ? Number(route.gasCostUSD).toFixed(2) : '—'}</span>
              <span style={{ fontWeight: 700, color: '#7F8AA1' }}>🕐 ~{durationStr}</span>
              <span style={{ color: impactColor, fontWeight: 700 }}>{impact > 0 ? `+${impact.toFixed(2)}%` : `${impact.toFixed(2)}%`}</span>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#7F8AA1', mt: 1, fontWeight: 700 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.72rem', color: '#7F8AA1', fontWeight: 700 }}>
              <span style={{ fontWeight: 700, color: '#7F8AA1' }}>≈ ${formatAmount(adjustedToAmountUSD, 2)}</span>
              <span style={{ color: '#7F8AA1', fontWeight: 700, margin: '0 0px' }}>·</span>
              <span style={{ fontWeight: 700, color: '#7F8AA1' }}>1 {route.fromToken?.symbol ?? ''} ≈ {impliedRate} {route.toToken?.symbol ?? ''}</span>
            </Box>
            <Button
              size="small"
              endIcon={<ExpandMoreIcon sx={{ fontSize: '1rem', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
              sx={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: expanded ? '#00e5a0' : '#7680a0',
                background: expanded ? 'rgba(0,229,160,0.10)' : selected ? 'rgba(0,229,160,0.01)' : (theme.palette.mode === 'dark' ? 'rgb(37,40,54)' : '#fff'),
                border: '1px solid',
                borderColor: expanded ? 'rgba(0,229,160,0.28)' : selected ? 'rgb(37,40,54)' : '#30364a',
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                minWidth: 0,
                textTransform: 'none',
              }}
              onClick={e => { e.stopPropagation(); onExpand(); }}
            >
              {expanded ? 'Hide Steps' : 'View Steps'}
            </Button>
          </Box>
        </Box>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ borderTop: '1px solid #30364a', background: (theme.palette.mode === 'dark' ? '#13151e' : '#fff'), p: 2 }}>
          <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#7680a0', mb: 2 }}>How to execute this route</Typography>
          {displaySteps.map((step: any, sidx: number) => (
            <Box key={sidx} sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: '#23263a', border: '1px solid #30364a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, color: step.type === 'swap' ? '#5b8cf5' : '#00e5a0', mt: 0.5 }}>{sidx + 1}</Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', px: 1, py: 0.5, borderRadius: 1, mb: 0.5, background: step.type === 'swap' ? 'rgba(91,140,245,0.12)' : 'rgba(0,229,160,0.10)', color: step.type === 'swap' ? '#5b8cf5' : '#00e5a0', border: '1px solid', borderColor: step.type === 'swap' ? 'rgba(91,140,245,0.3)' : 'rgba(0,229,160,0.28)' }}>{step.type === 'swap' ? '⇄ Swap' : '⇌ Bridge'}</Box>
                  {(() => {
                    const verb = step.type === 'cross' ? 'Bridge' : 'Swap';
                    const fromChain = getChainName(chains, step.action.fromChainId);
                    const toChain = getChainName(chains, step.action.toChainId);
                    const protocol = step.toolDetails?.name || step.label || '';
                    if (step.action.fromChainId === step.action.toChainId) {
                      return (
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#e4e8f5', mb: 0.5 }}>{`${verb} on ${fromChain} via ${protocol}`}</Typography>
                      );
                    } else {
                      return (
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#e4e8f5', mb: 0.5 }}>{`${verb} from ${fromChain} to ${toChain} via ${protocol}`}</Typography>
                      );
                    }
                  })()}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', color: '#7680a0', mb: 0.5 }}>
                    <Box sx={{ background: (theme.palette.mode === 'dark' ? '#23263a' : 'rgba(0,229,160,0.01)'), border: '1px solid #30364a', borderRadius: 1, px: 1, py: 0.5, fontWeight: 600 }}>{formatAmount(fromRawAmount(step.action.fromAmount, step.action.fromToken.decimals), 4)} {step.action.fromToken.symbol} on {getChainName(chains, step.action.fromChainId)}</Box>
                    <span style={{ color: '#424b64', fontSize: '0.7rem' }}>→</span>
                    <Box sx={{ background: (theme.palette.mode === 'dark' ? '#23263a' : 'rgba(0,229,160,0.01)'), border: '1px solid #30364a', borderRadius: 1, px: 1, py: 0.5, fontWeight: 600 }}>~{formatAmount(fromRawAmount(step.estimate.toAmount, step.action.toToken.decimals), 4)} {step.action.toToken.symbol} on {getChainName(chains, step.action.toChainId)}</Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.68rem', color: '#424b64' }}>
                    <span>⛽ Est. gas: {step.estimate.gasCosts?.[0]?.amountUSD ? `$${parseFloat(step.estimate.gasCosts[0].amountUSD).toFixed(3)}` : '—'}</span>
                    {(() => {
                      const url = step.toolDetails?.key ? PROTOCOL_URLS[step.toolDetails.key] : null;
                      const displayName = step.toolDetails?.name || '';
                      if (url) {
                        const host = url.replace(/^https?:\/\//, '').split('/')[0];
                        return <a href={url} target="_blank" rel="noopener" style={{ color: '#00e5a0', textDecoration: 'none' }}>{host} ↗</a>;
                      } else if (displayName) {
                        return <span style={{ color: '#00e5a0' }}>{displayName}</span>;
                      } else {
                        return null;
                      }
                    })()}
                    <span>· Re-enter amounts on site</span>
                  </Box>
                </Box>
              </Box>
              {/* Protocol Fees Box (Conditional) */}
              {(() => {
                const protocolFees = (step.estimate?.feeCosts || []).filter((f: any) => f.name !== "LIFI Fixed Fee");
                if (protocolFees.length === 0) return null;

                const protocolKey = step.toolDetails?.key;
                const protocolName = (step.toolDetails?.name || '').toUpperCase();
                let domain = protocolName + '.LINK';
                if (protocolKey && PROTOCOL_URLS[protocolKey]) {
                  const url = PROTOCOL_URLS[protocolKey];
                  domain = url.replace(/^https?:\/\//, '').split('/')[0].toUpperCase();
                }
                return (
                  <Box sx={{ background: (theme.palette.mode === 'dark' ? '#23263a' : 'rgba(0,229,160,0.01)'), borderRadius: 1, p: 2, border: '1px solid #30364a', width: '100%' }}>
                    <Typography fontWeight={600} fontSize={12} mb={1} sx={{ color: '#7680a0', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {protocolName} PROTOCOL FEES (APPLIED BY {domain})
                    </Typography>
                    {protocolFees.map((fee: any, i: number) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#e4e8f5', mb: 0.5 }}>
                        <span style={{ fontWeight: 400, fontSize: 13, color: '#7680a0' }}>{fee.name}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 400, fontSize: 13, color: '#7680a0' }}>
                          {formatAmount(fromRawAmount(fee.amount, fee.token.decimals), 6)} {fee.token.symbol} · <span style={{ color: '#7680a0', fontWeight: 400 }}>${parseFloat(fee.amountUSD).toFixed(3)}</span>
                        </span>
                      </Box>
                    ))}
                  </Box>
                );
              })()}
              {/* Minimum Received Row (last step only) */}
              {sidx === displaySteps.length - 1 && (
                <Box sx={{ background: (theme.palette.mode === 'dark' ? '#23263a' : 'rgba(0,229,160,0.01)'), borderRadius: 1, p: 1.5, mb: 1, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: 13, color: '#5b8cf5', fontWeight: 400 }}>🛡</span>
                    <Typography fontSize={13} fontWeight={400} sx={{ color: '#5b8cf5', letterSpacing: 0.01 }}>
                      Estimated minimum received
                    </Typography>
                  </Box>
                  <span style={{ color: '#5b8cf5', fontWeight: 400, fontSize: 13 }}>
                    ~{formatAmount(adjustedToAmountMin, 4)} {route.toToken.symbol}
                  </span>
                </Box>
              )}
            </Box>
          ))}
          <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #30364a', display: 'flex', alignItems: 'flex-start', gap: 1, fontSize: '0.72rem', color: '#7680a0', lineHeight: 1.45 }}>
            <span style={{ fontSize: '0.8rem' }}>ℹ</span>
            {displaySteps.length === 1
              ? `Single-step route — requires one wallet signature. Amounts shown are estimates; re-enter them manually on the protocol's site.`
              : `${displaySteps.length}-step route — each step requires a separate wallet signature. Amounts shown are estimates; re-enter them manually on each protocol's site.`}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};
