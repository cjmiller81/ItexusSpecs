import React, { useEffect, useState } from "react";
import { appAxios } from "../../lib/axios/customAxios";

interface Props {
  walletAddress: string;
}

function parseAndFormatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${month}/${day}/${year} at ${hours}:${minutes} ${ampm}`;
  } catch {
    return "Sync status unavailable";
  }
}

export const TransactionSyncStatus: React.FC<Props> = ({ walletAddress }) => {
  const [label, setLabel] = useState<string>("Loading…");
  const [anim, setAnim] = useState<boolean>(false);

  async function loadStatus() {
    if (!walletAddress) {
      setLabel("Sync status unavailable");
      return;
    }
    try {
      const res = await appAxios.get(`/api/wallet/${walletAddress}/sync-status`);
      const chains = res?.data?.chains;
      const raw = Array.isArray(chains) && chains.length > 0 ? chains[0]?.last_synced_at : null;
      if (raw) {
        setLabel(parseAndFormatDateTime(raw));
        setAnim(true);
        window.setTimeout(() => setAnim(false), 900);
      } else {
        setLabel("Sync status unavailable");
      }
    } catch (err) {
      console.error("Failed to fetch sync status", err);
      setLabel("Sync status unavailable");
    }
  }

  useEffect(() => {
    let mounted = true;
    if (!walletAddress) {
      setLabel("Sync status unavailable");
      return;
    }
    // initial load
    loadStatus();

    // listen to external updates (triggered by Sync Button)
    function onUpdate(e: Event) {
      try {
        const ev = e as CustomEvent;
        if (ev?.detail?.walletAddress === walletAddress) {
          const raw = ev.detail.last_synced_at;
          if (raw) {
            setLabel(parseAndFormatDateTime(raw));
            setAnim(true);
            window.setTimeout(() => setAnim(false), 900);
          } else {
            // fallback fetch
            loadStatus();
          }
        }
      } catch (err) {
        // ignore
      }
    }
    window.addEventListener("walletSyncStatusUpdated", onUpdate as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener("walletSyncStatusUpdated", onUpdate as EventListener);
    };
  }, [walletAddress]);

  return (
    <div className={`sync-pill ${anim ? "sync-anim" : ""}`} role="status" aria-live="polite">
      <div className="sync-icon">
        <span className="check">✓</span>
      </div>
      <div className="sync-text">
        <div className="sync-label">LAST SYNCED</div>
        <div className="sync-value">{label}</div>
      </div>
    </div>
  );
};