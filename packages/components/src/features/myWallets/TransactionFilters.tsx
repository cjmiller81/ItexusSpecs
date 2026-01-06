interface FiltersProps {
  dateFilter: string;
  setDateFilter: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  tokenFilter: string;
  setTokenFilter: (v: string) => void;
  hideSpam: boolean;
  setHideSpam: (v: boolean) => void;
  uniqueTokens: string[];
}

export function TransactionFilters(props: FiltersProps) {
  return (
    <div className="filters">
      {/* Date Filter */}
      <select 
        className="filter-select"
        value={props.dateFilter}
        onChange={(e) => props.setDateFilter(e.target.value)}
      >
        <option value="all">All Time</option>
        <option value="7">Last 7 Days</option>
        <option value="30">Last 30 Days</option>
        <option value="90">Last 90 Days</option>
      </select>

      {/* Type Filter */}
      <select 
        className="filter-select"
        value={props.typeFilter}
        onChange={(e) => props.setTypeFilter(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="deposit">Deposit</option>
        <option value="withdraw">Withdraw</option>
        <option value="claim">Claim</option>
        <option value="swap">Swap</option>
        <option value="transfer">Transfer</option>
        <option value="native_transfer">ETH Transfer</option>
      </select>

      {/* Token Filter */}
      <select 
        className="filter-select"
        value={props.tokenFilter}
        onChange={(e) => props.setTokenFilter(e.target.value)}
      >
        <option value="all">All Tokens</option>
        {props.uniqueTokens.map(token => (
          <option key={token} value={token}>{token}</option>
        ))}
      </select>

      {/* Spam Toggle */}
      <button 
        className={`spam-toggle ${!props.hideSpam ? 'showing-all' : ''}`}
        onClick={() => props.setHideSpam(!props.hideSpam)}
      >
        <span className="spam-toggle-label">
          {props.hideSpam ? '👁 Show All Transactions' : '🚫 Hide Spam Transactions'}
        </span>
        <div className="toggle-switch" />
      </button>
    </div>
  );
}