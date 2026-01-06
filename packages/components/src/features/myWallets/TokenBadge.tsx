import { TokenTransfer } from '../../types/transactions';
import { formatNumber, getTokenColor } from '../../utils/formatters';

interface TokenBadgeProps {
  transfer: TokenTransfer;
}

export function TokenBadge({ transfer }: TokenBadgeProps) {
  const sign = transfer.direction === 'in' ? '+' : '-';
  const colorClass = transfer.direction === 'in' ? 'in' : 'out';

  return (
    <div className={`token-badge ${colorClass}`}>
      {/* Icon with fallback */}
      {transfer.logoUrl ? (
        <img 
          src={transfer.logoUrl} 
          alt={transfer.symbol}
          className="token-icon"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
          }}
        />
      ) : null}
      <span 
        className="token-icon-fallback"
        style={{ 
          display: transfer.logoUrl ? 'none' : 'flex',
          background: getTokenColor(transfer.symbol)
        }}
      >
        {transfer.symbol.slice(0, 2).toUpperCase()}
      </span>

      {/* Amount */}
      <span>{sign}{formatNumber(transfer.amount)} {transfer.symbol}</span>

      {/* USD if available */}
      {transfer.usdValue != null && (
        <span className="token-usd">${formatNumber(transfer.usdValue)}</span>
      )}
    </div>
  );
}