import React from "react";
import { EnrichedTokenPosition, LifiChain } from "../utils/enrichTokenPositions";

interface ChainChipProps {
  lifiChain: LifiChain | null;
  networkName: string;
}

export const ChainChip: React.FC<ChainChipProps> = ({ lifiChain, networkName }) => {
  if (lifiChain) {
    return (
      <div className="chain-chip">
        {lifiChain.logoURI && (
          <img
            src={lifiChain.logoURI}
            alt={lifiChain.name}
            width={16}
            height={16}
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <span>{lifiChain.name}</span>
      </div>
    );
  }
  return (
    <div className="chain-chip chain-chip--unsupported">
      <span className="chain-chip__dot" />
      <span>{networkName}</span>
    </div>
  );
};

// CSS-in-JS styles (for MUI's sx or styled-components, or use as global CSS)
export const chainChipStyles = `
.chain-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #363640;
  border: 1px solid #4E4E57;
  border-radius: 6px;
  padding: 4px 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  color: #E0E0E0;
  white-space: nowrap;
}
.chain-chip img {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.chain-chip--unsupported {
  opacity: 0.55;
  border-color: #4E4E57;
}
.chain-chip__dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6B6B7A;
  flex-shrink: 0;
}
`;
