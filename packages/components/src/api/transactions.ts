import { TransactionHistoryResponse } from "../types/transactions";

function getBackendBaseUrl(): string {
  const publicUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const serverUrl = process.env.BACKEND_API_URL;
  if (typeof window === "undefined") {
    return serverUrl ?? publicUrl ?? "";
  }
  return publicUrl ?? serverUrl ?? window.location.origin;
}

const API_BASE = getBackendBaseUrl();

export async function fetchTransactions(
  paramsOrAddress: Record<string, string | number | undefined> | string = {}
): Promise<TransactionHistoryResponse> {
  let address: string | undefined;
  let params: Record<string, string | number | undefined> = {};

  if (typeof paramsOrAddress === "string") {
    address = paramsOrAddress || undefined;
  } else if (paramsOrAddress && typeof paramsOrAddress === "object") {
    params = { ...paramsOrAddress };
    if (typeof params.address === "string" && params.address !== "") {
      address = params.address;
      delete params.address;
    }
  }

  const path = address
    ? `/api/wallet/${encodeURIComponent(address)}/transactions`
    : "/api/transactions";

  const url = new URL(path, API_BASE);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== "") url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch transactions: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchTransactionByHash(hash: string) {
  const url = new URL(`/api/transactions/${encodeURIComponent(hash)}`, API_BASE);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch transaction ${hash}: ${res.status} ${text}`);
  }
  return res.json();
}