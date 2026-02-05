export const typeConfig: Record<string, { icon: string; label: string; bgColor: string; textColor: string }> = {
  swap:            { icon: '⇅',  label: 'SWAP',         bgColor: 'rgba(139, 92, 246, 0.15)', textColor: '#a78bfa' },
  deposit:         { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><circle cx="18" cy="12" r="2"/><path d="M9 17v-4m-2 2h4" stroke-width="2.5"/></svg>', label: 'DEPOSIT',      bgColor: 'rgba(59, 130, 246, 0.15)',  textColor: '#60a5fa' },
  withdraw:        { icon: '←',  label: 'WITHDRAW',     bgColor: 'rgba(251, 146, 60, 0.15)', textColor: '#fb923c' },
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