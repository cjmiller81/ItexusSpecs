// VaultsApiResponse.ts
export type VaultsApiResponse = {
  status: string; // Response status (e.g., "success" or "error")
  data: {
    id: string; // Unique identifier for the vault
    name: string; // Name of the vault
    apy: number; // Annual percentage yield
    tvl: number; // Total value locked
    token: string; // The token associated with the vault
    // Additional fields can be added here
  }[]; // An array of vault data
};

// BoostsApiResponse.ts
export type BoostsApiResponse = {
  status: string; // Response status (e.g., "success" or "error")
  data: {
    id: string; // Unique identifier for the boost
    name: string; // Name of the boost
    multiplier: number; // Boost multiplier
    token: string; // The token associated with the boost
    // Additional fields can be added here
  }[]; // An array of boost data
};
