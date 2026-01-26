import React, { useEffect, useRef, useState } from "react";
import { appAxios } from "../../lib/axios/customAxios";

const COOLDOWN_MINUTES = 15;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;
const STORAGE_KEY = "syncCooldownEnd";

interface Props {
  walletAddress: string;
  onSyncComplete?: () => void;
}

export const TransactionSyncButton: React.FC<Props> = ({ walletAddress, onSyncComplete }) => {
  const [syncing, setSyncing] = useState(false);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
  const [remainingText, setRemainingText] = useState<string>("");
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // read persisted cooldown on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const end = parseInt(raw, 10);
      if (!isNaN(end) && Date.now() < end) {
        setCooldownEnd(end);
        startCountdown(end);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  function formatMs(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function startCountdown(endTime: number) {
    // update immediately
    updateRemaining(endTime);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => updateRemaining(endTime), 1000);
  }

  function updateRemaining(endTime: number) {
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      localStorage.removeItem(STORAGE_KEY);
      setCooldownEnd(null);
      setRemainingText("");
      return;
    }
    setRemainingText(`(${formatMs(remaining)})`);
  }

  function startCooldown() {
    const end = Date.now() + COOLDOWN_MS;
    localStorage.setItem(STORAGE_KEY, end.toString());
    setCooldownEnd(end);
    startCountdown(end);
  }

  async function handleClick() {
    setError(null);
    if (!walletAddress) {
      setError("No wallet selected");
      return;
    }
    if (syncing) return;
    if (cooldownEnd && Date.now() < cooldownEnd) return;

    setSyncing(true);
    try {
      // POST to trigger sync
      await appAxios.post(`/api/wallet/${walletAddress}/sync`);
      // on success, refresh sync status (GET) and notify TransactionSyncStatus
      try {
        const res = await appAxios.get(`/api/wallet/${walletAddress}/sync-status`);
        const chains = res?.data?.chains;
        const raw = Array.isArray(chains) && chains.length > 0 ? chains[0]?.last_synced_at : null;
        // notify listeners (TransactionSyncStatus) to update label + animate
        window.dispatchEvent(new CustomEvent("walletSyncStatusUpdated", {
          detail: { walletAddress, last_synced_at: raw }
        }));
      } catch (err) {
        console.error("Failed to fetch sync status after sync", err);
      }
      // start cooldown
      startCooldown();
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (err) {
      console.error("Sync failed", err);
      setError("Sync failed — try again");
    } finally {
      setSyncing(false);
      // tooltip visibility is controlled by hover OR syncing OR cooldown
    }
  }

  const isCooldownActive = !!cooldownEnd && Date.now() < cooldownEnd;
  const disabled = syncing || isCooldownActive;
  // show tooltip only when the pointer is hovering the component
  const showTooltip = isHovering;

  return (
    <div
      style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Cooldown timer */}
      {isCooldownActive && (
        <div className="sync-cooldown-timer" aria-hidden>
          {remainingText}
        </div>
      )}

      <button
        className={`sync-btn ${syncing ? "syncing" : ""} ${isCooldownActive ? "cooldown" : ""}`}
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={syncing}
      >
        <span className="sync-icon" aria-hidden>
          ↻
        </span>
        <span className="sync-text">{syncing ? "Syncing..." : "Sync New Transactions"}</span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="sync-tooltip" role="tooltip">
          {syncing ? "Fetching new transactions..." : isCooldownActive ? `Available in ${remainingText.replace(/[()]/g,'')}` : "Click to fetch latest transactions"}
          <span className="tooltip-arrow" />
        </div>
      )}

      {/* Inline error */}
      {error && <div style={{ color: "#f87171", marginLeft: 8, fontSize: 12 }}>{error}</div>}
    </div>
  );
};