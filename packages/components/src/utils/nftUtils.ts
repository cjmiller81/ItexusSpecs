
export const NFT_CONSTANTS = {
  SHORT_COLLECTION_LENGTH: 10,
  PREVIOUS_NAME_PATTERN: /Previous name: (.+)/,
} as const;

export const escapeRegExp = (s: string): string => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const createTokenIdRegex = (tokenId: string): RegExp => {
  const escapedId = escapeRegExp(tokenId);
  return new RegExp(`\\s*#\\s*${escapedId}$`);
};

export const extractNFTName = (collectionName?: string | null, tokenId?: string | number): string => {
  const idStr = String(tokenId ?? "");
  
  if (!collectionName) {
    return `NFT #${idStr}`;
  }

  if (collectionName.startsWith("#") && collectionName.length < NFT_CONSTANTS.SHORT_COLLECTION_LENGTH) {
    return `Token ${collectionName}`;
  }

  if (collectionName.includes("Previous name:")) {
    const match = collectionName.match(NFT_CONSTANTS.PREVIOUS_NAME_PATTERN);
    return match ? match[1] : collectionName;
  }

  if (!collectionName.startsWith("#")) {
    const normalized = collectionName.trim();
    const tokenIdRegex = createTokenIdRegex(idStr);
    const hasExactId = normalized.includes(`#${idStr}`) || tokenIdRegex.test(normalized);
    return hasExactId ? normalized : `${normalized} #${idStr}`;
  }

  return collectionName;
};

export const cleanCollectionName = (collectionName?: string | null, tokenId?: string | number): string => {
  if (!collectionName) return "";
  
  if (collectionName.startsWith("#")) return collectionName;
  
  const idStr = String(tokenId ?? "");
  const tokenIdRegex = createTokenIdRegex(idStr);
  
  const cleanedExact = collectionName.replace(tokenIdRegex, "").trim();
  if (cleanedExact.length > 0) return cleanedExact;

  const cleanedDigits = collectionName.replace(/\s*#\s*\d+$/, "").trim();
  return cleanedDigits.length > 0 ? cleanedDigits : collectionName;
};

export const processNFTImageUrl = (imageUrl: any): string | null => {
  if (!imageUrl) return null;
  
  if (typeof imageUrl === "object") {
    return (
      imageUrl.thumbnail || 
      imageUrl.medium || 
      imageUrl.original || 
      Object.values(imageUrl)[0] || 
      null
    );
  }
  
  if (typeof imageUrl === "string") {
    return imageUrl;
  }
  
  return null;
};

export const filterValidNFTs = (nfts: any[]): any[] => {
  return nfts.filter((nft) => {
    const isInvalid = nft.collectionName?.includes("INVALID AND WORTHLESS");
    const hasMinimalValue = nft.estimatedValue > 0.01;
    return !isInvalid && hasMinimalValue;
  });
};



