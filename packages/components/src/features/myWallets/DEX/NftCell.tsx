import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import { extractNFTName, cleanCollectionName } from "../../../utils/nftUtils";
import { useImageError } from "../../../hooks/useImageError";
import { NFT_SIZES } from "../../../constants/sizes";

interface NftCellProps {
  imageUrl?: string | null;
  collectionName?: string | null;
  tokenId: string | number;
}

interface ProcessedNftData {
  nftName: string;
  displayCollection: string;
  idStr: string;
}

const useNftData = (collectionName?: string | null, tokenId?: string | number): ProcessedNftData => {
  return useMemo(() => {
    const idStr = String(tokenId ?? "");
    const nftName = extractNFTName(collectionName, tokenId);
    const displayCollection = cleanCollectionName(collectionName, tokenId);

    return {
      nftName,
      displayCollection,
      idStr,
    };
  }, [collectionName, tokenId]);
};

const NftImage: React.FC<{ imageUrl: string; alt: string; onError: () => void }> = ({ 
  imageUrl, 
  alt, 
  onError 
}) => (
  <img
    src={imageUrl}
    alt={alt}
    style={{ 
      width: NFT_SIZES.IMAGE_SIZE, 
      height: NFT_SIZES.IMAGE_SIZE, 
      borderRadius: NFT_SIZES.IMAGE_BORDER_RADIUS, 
      objectFit: "cover" 
    }}
    onError={onError}
  />
);

const NftPlaceholder: React.FC = () => (
  <Box sx={{
    width: NFT_SIZES.IMAGE_SIZE, 
    height: NFT_SIZES.IMAGE_SIZE, 
    borderRadius: 1,
    bgcolor: (t) => t.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
    color: (t) => t.palette.text.secondary,
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexShrink: 0
  }}>
    <WallpaperIcon sx={{ width: NFT_SIZES.ICON_SIZE, height: NFT_SIZES.ICON_SIZE, opacity: 0.8 }} />
  </Box>
);

const NftInfo: React.FC<{ nftName: string; displayCollection: string; idStr: string }> = ({ 
  nftName, 
  displayCollection, 
  idStr 
}) => (
  <Box minWidth={0}>
    <Typography fontWeight={600} noWrap title={nftName}>
      {nftName}
    </Typography>

    <Typography variant="body2" color="text.secondary" noWrap title={displayCollection}>
      {displayCollection}
    </Typography>

    <Typography variant="caption" color="text.secondary" noWrap>
      #{idStr}
    </Typography>
  </Box>
);

export const NftCell: React.FC<NftCellProps> = ({ imageUrl, collectionName, tokenId }) => {
  const { hasImage, handleImageError } = useImageError(imageUrl);
  const { nftName, displayCollection, idStr } = useNftData(collectionName, tokenId);

  return (
    <Box display="flex" alignItems="center" gap={1} minWidth={0}>
      {hasImage ? (
        <NftImage 
          imageUrl={imageUrl as string} 
          alt={nftName} 
          onError={handleImageError} 
        />
      ) : (
        <NftPlaceholder />
      )}

      <NftInfo 
        nftName={nftName} 
        displayCollection={displayCollection} 
        idStr={idStr} 
      />
    </Box>
  );
};

export default NftCell;
