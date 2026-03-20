import React, { useEffect, useRef, useState } from "react";
import { appAxios } from "../../lib/axios/customAxios";
import { toast } from "react-toastify";

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
  const [showPatienceMsg, setShowPatienceMsg] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const pollRef = useRef<number | null>(null);

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
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
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
    setShowPatienceMsg(true);
    try {
      // Start the sync process by calling the POST endpoint
      const initialStatus = await appAxios.post(`/api/wallet/${walletAddress}/sync`);
      const initialTimestamps = extractTimestamps(initialStatus.data.chains);

      // Immediately notify TransactionSyncStatus of the initial sync state
      const chains = initialStatus.data.chains || [];
      const totalChains = chains.length;
      const syncedChains = chains.filter((c: any) => !c.sync_in_progress).length;
      window.dispatchEvent(
        new CustomEvent("walletSyncStatusUpdated", {
          detail: { walletAddress, syncedChains, totalChains },
        })
      );

      pollRef.current = window.setInterval(async () => {
        try {
          const currentStatus = await appAxios.get(`/api/wallet/${walletAddress}/sync-status`);
          const currentTimestamps = extractTimestamps(currentStatus.data.chains);

          const syncedChains = countSyncedChains(initialTimestamps, currentTimestamps);
          const totalChains = currentTimestamps.size;

          // Notify TransactionSyncStatus of progress
          window.dispatchEvent(
            new CustomEvent("walletSyncStatusUpdated", {
              detail: { walletAddress, syncedChains, totalChains },
            })
          );

          // Check if all chains are synced
          const allSynced = Array.from(currentTimestamps.values()).every(
            (v) => v.sync_in_progress === false
          );
          if (allSynced) {
            window.clearInterval(pollRef.current!);
            pollRef.current = null;

            // Notify TransactionSyncStatus of completion
            window.dispatchEvent(
              new CustomEvent("walletSyncStatusUpdated", {
                detail: { walletAddress, last_synced_at: new Date().toISOString() },
              })
            );

            toast.success("Sync completed!", { position: "top-center", autoClose: 5000 });
            setShowPatienceMsg(false);
            startCooldown();
            if (onSyncComplete) {
              onSyncComplete();
            }
            setSyncing(false);
          }
        } catch (err) {
          console.error("Polling failed", err);
        }
      }, 60000); // poll every 1 minute
    } catch (err) {
      console.error("Sync failed", err);
      setError("Sync failed — try again");
      setSyncing(false);
      setShowPatienceMsg(false);
      // tooltip visibility is controlled by hover OR syncing OR cooldown
    }
  }

  function extractTimestamps(chains: any[]) {
    const timestamps = new Map<string, { last_synced_at: string; sync_in_progress: boolean }>();
    chains.forEach((chain) => {
      timestamps.set(chain.chain_name, { last_synced_at: chain.last_synced_at, sync_in_progress: chain.sync_in_progress });
    });
    return timestamps;
  }

  function countSyncedChains(initial: Map<string, { last_synced_at: string; sync_in_progress: boolean }>, current: Map<string, { last_synced_at: string; sync_in_progress: boolean }>) {
    let count = 0;
    current.forEach((timestamp, chain) => {
      if (!initial.has(chain) || !timestamp.sync_in_progress) {
        count++;
      }
    });
    return count;
  }

  const isCooldownActive = !!cooldownEnd && Date.now() < cooldownEnd;
  const disabled = syncing || isCooldownActive;
  // show tooltip only when the pointer is hovering the component
  const showTooltip = isHovering;

  return (
    <div
      style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, flexDirection: "column" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Cooldown timer (show only after sync completes) */}
      {!syncing && isCooldownActive && (
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
          {syncing
            ? "Fetching new transactions..."
            : isCooldownActive
            ? `Available in ${remainingText.replace(/[()]/g, "")}`
            : "Click to fetch latest transactions"}
          <span className="tooltip-arrow" />
        </div>
      )}

      {/* Patience message below progress indicator */}
      {showPatienceMsg && (
        <div style={{ marginTop: 8, color: '#888', fontSize: 13, maxWidth: 320 }}>
          Syncing this wallet may take a while, please be patient. You will be notified when sync has completed.
        </div>
      )}

      {/* Inline error */}
      {error && <div style={{ color: "#f87171", marginLeft: 8, fontSize: 12 }}>{error}</div>}
    </div>
  );
};