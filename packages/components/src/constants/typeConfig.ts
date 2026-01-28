export const typeConfig: Record<string, { icon: string; label: string; bgColor: string; textColor: string }> = {
  swap:            { icon: '⇅',  label: 'SWAP',         bgColor: 'rgba(139, 92, 246, 0.15)', textColor: '#a78bfa' },
  deposit:         { icon: '↓',  label: 'DEPOSIT',      bgColor: 'rgba(59, 130, 246, 0.15)',  textColor: '#60a5fa' },
  withdraw:        { icon: '↑',  label: 'WITHDRAW',     bgColor: 'rgba(251, 146, 60, 0.15)', textColor: '#fb923c' },
  claim:           { icon: '💰', label: 'CLAIM',        bgColor: 'rgba(16, 185, 129, 0.2)',  textColor: '#fbbf24' },
  transfer:        { icon: '→',  label: 'TRANSFER',     bgColor: 'rgba(6, 182, 212, 0.15)',  textColor: '#22d3ee' },
  native_transfer: { icon: 'Ξ',  label: 'ETH TRANSFER', bgColor: 'rgba(99, 102, 241, 0.15)', textColor: '#818cf8' },
  approval:        { icon: '🔓',  label: 'APPROVAL',     bgColor: 'rgba(250, 204, 21, 0.15)', textColor: '#facc15' },
  unknown:         { icon: '?',  label: 'UNKNOWN',      bgColor: 'rgba(100, 116, 139, 0.15)', textColor: '#94a3b8' }
};

// Generate consistent color from any token symbol
export function getTokenColor(symbol: string): string {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash % 360)}, 55%, 50%)`;
}