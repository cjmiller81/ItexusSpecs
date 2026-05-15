import React, { useEffect, useState } from "react";
import { appAxios } from "../../lib/axios/customAxios";

export interface TransactionSyncStatusProps {
  walletAddress: string;
}

export const TransactionSyncStatus: React.FC<TransactionSyncStatusProps> = ({ walletAddress }) => {
  const [label, setLabel] = useState<string>("Loading…");
  const [anim, setAnim] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

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
          setLabel(`Last synced: ${new Date(raw).toLocaleString()}`);
        } else {
          setLabel("Sync status unavailable");
        }
      } catch (err) {
        console.error("Failed to fetch sync status", err);
        setLabel("Sync status unavailable");
      }
    }

    loadStatus();

    function onUpdate(e: Event) {
      const ev = e as CustomEvent;
      if (ev?.detail?.walletAddress === walletAddress) {
        if (ev.detail.syncedChains !== undefined && ev.detail.totalChains !== undefined) {
          setLabel(`${ev.detail.syncedChains} of ${ev.detail.totalChains} chains synced`);
        } else if (ev.detail.last_synced_at) {
          setLabel(`Last synced: ${new Date(ev.detail.last_synced_at).toLocaleString()}`);
        }
      }
    }

    window.addEventListener("walletSyncStatusUpdated", onUpdate as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener("walletSyncStatusUpdated", onUpdate as EventListener);
    };
  }, [walletAddress]);

  return (
    <div
      className={`sync-pill ${anim ? "sync-anim" : ""}`}
      role="status"
      aria-live="polite">
      <div className="sync-icon">
        <span className="check">✓</span>
      </div>
      <div className="sync-text">
        <div className="sync-label">SYNC STATUS</div>
        <div className="sync-value">{label}</div>
      </div>
    </div>
  );
};
