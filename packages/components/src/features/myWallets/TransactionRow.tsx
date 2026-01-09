import { Transaction } from '../../types/transactions';
import { formatDate, formatHash } from '../../utils/formatters';
import { TokenBadge } from './TokenBadge';
import { typeConfig as TYPE_CONFIG, getTokenColor } from "../../constants/typeConfig";

const CHAIN_CONFIG: Record<string, { name: string; class: string; icon: string }> = {
  'eth-mainnet': { name: 'Ethereum', class: 'eth', icon: 'Ξ' },
  'base-mainnet': { name: 'Base', class: 'base', icon: '🔵' },
  'optimism-mainnet': { name: 'Optimism', class: 'optimism', icon: '🔴' },
  'matic-mainnet': { name: 'Polygon', class: 'polygon', icon: '🟣' },
  'bsc-mainnet': { name: 'BSC', class: 'bsc', icon: '🟡' },
  'scroll-mainnet': { name: 'Scroll', class: 'scroll', icon: '📜' },
};

interface TransactionRowProps {
  transaction: Transaction;
  borderColors: { borderColor: string };
}

export function TransactionRow({ transaction, borderColors }: TransactionRowProps) {
  const typeConfig = TYPE_CONFIG[transaction.type] || TYPE_CONFIG.unknown;
  const chainCfg = CHAIN_CONFIG[transaction.chainName] || { name: transaction.chainName, class: '', icon: '🔗' };

  // Filter zero-amount transfers
  const meaningfulTransfers = transaction.transfers.filter(t => t.amount > 0);

  return (
    <div className={`tx-row ${transaction.spam.isSpam ? 'spam' : ''}`} style={borderColors}>
      {/* Type Icon */}
      <div className={`tx-icon ${transaction.type}`}>
        {typeConfig.icon}
      </div>

      {/* Left Content */}
      <div className="tx-left">
        {/* Row 1: Type, Chain, Date, Spam badge */}
        <div className="tx-type-date-row">
          <span className={`tx-type-badge ${transaction.type}`}>
            {typeConfig.label}
          </span>
          <span className={`tx-chain-badge ${chainCfg.class}`}>
            {chainCfg.icon} {chainCfg.name}
          </span>
          <span className="tx-date">
            {formatDate(transaction.timestamp)}
          </span>
          {transaction.protocol && (
            <span className="tx-protocol">{transaction.protocol}</span>
          )}
          {transaction.spam.isSpam && (
            <span className="spam-badge">● SPAM</span>
          )}
        </div>

        {/* Row 2: Gas, Hash */}
        <div className="tx-gas-hash-row">
          <span className="tx-gas">⛽ ${transaction.gasUsd.toFixed(4)}</span>
          <span className="tx-hash">
            <a href={transaction.explorerUrl} target="_blank" rel="noopener noreferrer">
              {formatHash(transaction.hash)} ↗
            </a>
          </span>
        </div>
      </div>

      {/* Right: Token Flows */}
      <div className="tx-tokens">
        {meaningfulTransfers.length > 0 ? (
          meaningfulTransfers.map((transfer, idx) => (
            <TokenBadge key={idx} transfer={transfer} />
          ))
        ) : (
          <span className="no-transfers">No token transfers</span>
        )}
      </div>
    </div>
  );
}