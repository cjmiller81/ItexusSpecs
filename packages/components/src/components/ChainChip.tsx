import React from "react";
import { EnrichedTokenPosition, LifiChain } from "../utils/enrichTokenPositions";
import { useTheme } from "@mui/material/styles";

export interface ChainChipProps {
  lifiChain: LifiChain | null;
  networkName: string;
}

export const ChainChip: React.FC<ChainChipProps> = ({ lifiChain, networkName }) => {
  const theme = useTheme();
  const themeClass = theme.palette.mode === "light" ? "theme-light" : "theme-dark";
  if (lifiChain) {
    return (
      <div
        className={`${themeClass} chain-chip`}
        style={{ border: `1px solid ${theme.palette.mode === "light" ? "#e0e0e0" : "#4E4E57"}` }}>
        {lifiChain.logoURI && (
          <img
            src={lifiChain.logoURI}
            alt={lifiChain.name}
            width={16}
            height={16}
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <span>{lifiChain.name}</span>
      </div>
    );
  }
  return (
    <div className={`${themeClass} chain-chip chain-chip--unsupported`}>
      <span className={`${themeClass} chain-chip__dot`} />
      <span>{networkName}</span>
    </div>
  );
};
