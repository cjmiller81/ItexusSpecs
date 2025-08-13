import { useState, useCallback, useMemo } from 'react';

export const useImageError = (imageUrl?: string | null) => {
  const [imgError, setImgError] = useState(false);
  
  const handleImageError = useCallback(() => {
    setImgError(true);
  }, []);

  const hasImage = useMemo(() => {
    return !!imageUrl && !imgError;
  }, [imageUrl, imgError]);

  const resetError = useCallback(() => {
    setImgError(false);
  }, []);

  return {
    hasImage,
    handleImageError,
    imgError,
    resetError,
  };
};
