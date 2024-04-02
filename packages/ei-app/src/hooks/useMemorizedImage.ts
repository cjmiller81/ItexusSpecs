import { useRef, useEffect } from 'react';

export function useMemoizedImage(url?: string) {
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) return

    if (imageRef.current && imageRef.current.src === url) {
      return; // Image already loaded and hasn't changed
    }

    const image = new Image();
    image.src = url;

    image.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = url;
      }
    };

    // Cleanup to prevent memory leaks
    return () => {
      image.onload = null;
    };
  }, [url]);

  return imageRef;
}